"""Confere links, metadados e recursos do site estático antes da publicação."""

import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parent.parent / "public"
ORIGIN = "https://amandapetsitter.com"
OLD_PATH = "/amanda-pet-sitter/"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.references = []
        self.canonical = []
        self.metadata = {}
        self.json_scripts = []
        self._json_script = None

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        for name in ("href", "src"):
            if attrs.get(name):
                self.references.append(attrs[name])
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs.get("href"))
        if tag == "meta" and attrs.get("property"):
            self.metadata[attrs["property"]] = attrs.get("content")
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._json_script = []

    def handle_data(self, data):
        if self._json_script is not None:
            self._json_script.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._json_script is not None:
            self.json_scripts.append("".join(self._json_script))
            self._json_script = None


def site_path(path):
    return ROOT / unquote(path).lstrip("/")


def page_path(path):
    candidate = site_path(path)
    return candidate / "index.html" if candidate.is_dir() else candidate


def target_path(source, path):
    if not path:
        return source
    if path.startswith("/"):
        return page_path(path)
    return page_path("/" + (source.parent / path).relative_to(ROOT).as_posix())


def check():
    errors = []
    parsed = {}
    files = sorted(ROOT.rglob("*.html"))

    for file in files:
        content = file.read_text(encoding="utf-8")
        if OLD_PATH in content or "leonardodcb.github.io" in content:
            errors.append(f"{file}: referência ao endereço antigo")
        page = Page()
        page.feed(content)
        parsed[file] = page

        for script in page.json_scripts:
            try:
                json.loads(script)
            except json.JSONDecodeError as exc:
                errors.append(f"{file}: JSON-LD inválido: {exc}")

        is_not_found = file.name == "404.html"
        url = ORIGIN + ("/" if file == ROOT / "index.html" else "/" + file.relative_to(ROOT).as_posix())
        if is_not_found:
            if page.canonical or 'name="robots" content="noindex' not in content:
                errors.append(f"{file}: página 404 deve manter noindex e não ter canonical")
        else:
            if page.canonical != [url] or page.metadata.get("og:url") != url:
                errors.append(f"{file}: canonical ou og:url não coincide com {url}")
            image = page.metadata.get("og:image", "")
            if not image.startswith(ORIGIN + "/") or not site_path(urlsplit(image).path).is_file():
                errors.append(f"{file}: og:image ausente ou inválida")

        for reference in page.references:
            parts = urlsplit(reference)
            if parts.scheme and parts.scheme not in ("http", "https"):
                continue
            if parts.netloc and parts.netloc != "amandapetsitter.com":
                continue
            destination = target_path(file, parts.path)
            if not destination.is_file():
                errors.append(f"{file}: recurso ou página inexistente: {reference}")

        if 'id="menu-botao"' not in content or 'id="menu-navegacao"' not in content or 'id="menu-overlay"' not in content:
            errors.append(f"{file}: estrutura do menu móvel incompleta")
        if "js/site.js" not in content and "js/menu.js" not in content:
            errors.append(f"{file}: script do menu móvel ausente")

    for file, page in parsed.items():
        for reference in page.references:
            parts = urlsplit(reference)
            if not parts.fragment or (parts.netloc and parts.netloc != "amandapetsitter.com"):
                continue
            if parts.scheme and parts.scheme not in ("http", "https"):
                continue
            target = target_path(file, parts.path)
            if target in parsed and unquote(parts.fragment) not in parsed[target].ids:
                errors.append(f"{file}: âncora inexistente: {reference}")

    sitemap = ElementTree.parse(ROOT / "sitemap.xml")
    listed = {node.text for node in sitemap.findall(".//{*}loc")}
    expected = {ORIGIN + ("/" if file == ROOT / "index.html" else "/" + file.relative_to(ROOT).as_posix()) for file in files if file.name != "404.html"}
    if listed != expected:
        errors.append(f"sitemap.xml: faltando {sorted(expected - listed)}, extras {sorted(listed - expected)}")
    if f"Sitemap: {ORIGIN}/sitemap.xml" not in (ROOT / "robots.txt").read_text(encoding="utf-8"):
        errors.append("robots.txt: endereço do sitemap incorreto")

    if errors:
        raise SystemExit("\n".join(errors))
    print(f"OK: {len(files)} páginas, {len(listed)} URLs no sitemap, links e metadados conferidos.")


if __name__ == "__main__":
    check()
