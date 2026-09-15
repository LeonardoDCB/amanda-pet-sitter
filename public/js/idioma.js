(function () {
  const IDIOMAS = { pt: "Português", en: "English", es: "Español" };
  const CHAVES = {
    "Início": ["Home", "Inicio"],
    "Principal": ["Home", "Inicio"],
    "Sobre": ["About", "Sobre mí"],
    "Serviços": ["Services", "Servicios"],
    "Visita": ["Visits", "Visitas"],
    "Hospedagem": ["Boarding", "Hospedaje"],
    "Passeio": ["Dog walking", "Paseo"],
    "Galeria": ["Gallery", "Galería"],
    "Loja": ["Shop", "Tienda"],
    "Orçamento": ["Request a quote", "Presupuesto"],
    "Dicas": ["Tips", "Consejos"],
    "Dicas para tutores": ["Tips for pet parents", "Consejos para tutores"],
    "Perguntas frequentes": ["Frequently asked questions", "Preguntas frecuentes"],
    "Contato": ["Contact", "Contacto"],
    "Navegação": ["Navigation", "Navegación"],
    "Falar no WhatsApp": ["Chat on WhatsApp", "Hablar por WhatsApp"],
    "Chamar no WhatsApp": ["Chat on WhatsApp", "Hablar por WhatsApp"],
    "Conversar no WhatsApp": ["Chat on WhatsApp", "Conversar por WhatsApp"],
    "Tirar dúvida no WhatsApp": ["Ask on WhatsApp", "Preguntar por WhatsApp"],
    "Instagram": ["Instagram", "Instagram"],
    "Ver detalhes": ["See details", "Ver detalles"],
    "Conhecer os serviços": ["Explore services", "Conocer los servicios"],
    "Pedir orçamento": ["Request a quote", "Pedir presupuesto"],
    "Formulário de orçamento": ["Quote form", "Formulario de presupuesto"],
    "Abrir orçamento no WhatsApp": ["Open quote on WhatsApp", "Abrir presupuesto en WhatsApp"],
    "Voltar ao início": ["Back to home", "Volver al inicio"],
    "Pronto para começar?": ["Ready to get started?", "¿Listo para comenzar?"],
    "Onde atendo": ["Where I work", "Dónde atiendo"],
    "Como funciona": ["How it works", "Cómo funciona"],
    "Por que escolher": ["Why choose it", "Por qué elegirlo"],
    "Para tutores": ["For pet parents", "Para tutores"],
    "Dúvidas comuns": ["Common questions", "Preguntas frecuentes"],
    "Pronto para agendar?": ["Ready to book?", "¿Listo para reservar?"],
    "Pronto para reservar?": ["Ready to book?", "¿Listo para reservar?"],
    "Pronto para sair?": ["Ready to go?", "¿Listo para salir?"],
    "Falar sobre meu pet": ["Talk about my pet", "Hablar sobre mi mascota"],
    "Reservar hospedagem": ["Book boarding", "Reservar hospedaje"],
    "Agendar passeio": ["Book a walk", "Agendar paseo"],
    "Ver dicas para tutores": ["See tips for pet parents", "Ver consejos para tutores"],
    "Enviar outro orçamento": ["Send another quote", "Enviar otro presupuesto"],
    "Confirmar no WhatsApp": ["Confirm on WhatsApp", "Confirmar por WhatsApp"],
    "Seu nome": ["Your name", "Tu nombre"],
    "Contato (WhatsApp ou e-mail)": ["Contact (WhatsApp or email)", "Contacto (WhatsApp o correo)"],
    "Tipo de pet": ["Pet type", "Tipo de mascota"],
    "Serviço": ["Service", "Servicio"],
    "Porte do cachorro": ["Dog size", "Tamaño del perro"],
    "Usa medicação?": ["Does your pet take medication?", "¿Usa medicamentos?"],
    "Qual medicação? (opcional)": ["Which medication? (optional)", "¿Qué medicamento? (opcional)"],
    "Data de início": ["Start date", "Fecha de inicio"],
    "Data de fim": ["End date", "Fecha de finalización"],
    "(opcional)": ["(optional)", "(opcional)"],
    "Mensagem": ["Message", "Mensaje"],
    "Cachorro": ["Dog", "Perro"],
    "Gato": ["Cat", "Gato"],
    "Outro": ["Other", "Otro"],
    "Pequeno": ["Small", "Pequeño"],
    "Grande": ["Large", "Grande"],
    "Não": ["No", "No"],
    "Sim": ["Yes", "Sí"],
    "Visita em domicílio": ["In-home visit", "Visita a domicilio"],
    "Hospedagem na casa da Amanda": ["Boarding at Amanda's home", "Hospedaje en casa de Amanda"],
    "Passeio com o pet": ["Pet walk", "Paseo con la mascota"],
    "Atualizações diárias": ["Daily updates", "Actualizaciones diarias"],
    "Ambiente familiar": ["Family environment", "Ambiente familiar"],
    "Pet sempre supervisionado": ["Pets always supervised", "Mascotas siempre supervisadas"],
    "Disponível para novas reservas": ["Available for new bookings", "Disponible para nuevas reservas"],
    "Cuidado com amor, carinho e segurança para o seu pet, em Birigui e Araçatuba-SP.": ["Loving, caring and safe pet care in Birigui and Araçatuba-SP.", "Cuidado con amor, cariño y seguridad para tu mascota en Birigui y Araçatuba-SP."],
    "Feito com 🐾 para pets bem cuidados": ["Made with 🐾 for well-cared-for pets", "Hecho con 🐾 para mascotas bien cuidadas"],
    "Carregando galeria…": ["Loading gallery…", "Cargando galería…"],
    "Carregando produtos…": ["Loading products…", "Cargando productos…"],
    "Seu carrinho está vazio.": ["Your cart is empty.", "Tu carrito está vacío."],
    "Adicionar": ["Add", "Añadir"],
    "Disponível": ["Available", "Disponible"],
    "Finalizar pedido": ["Complete order", "Finalizar pedido"],
    "Seu pedido foi enviado!": ["Your order was sent!", "¡Tu pedido fue enviado!"],
    "Total": ["Total", "Total"],
    "Pular para o conteúdo": ["Skip to content", "Saltar al contenido"],
    "Página não encontrada": ["Page not found", "Página no encontrada"],
    "Confira os campos destacados.": ["Please check the highlighted fields.", "Revisa los campos resaltados."],
    "Informe seu nome.": ["Please enter your name.", "Escribe tu nombre."],
    "Informe um contato (WhatsApp ou e-mail).": ["Please enter a contact (WhatsApp or email).", "Escribe un contacto (WhatsApp o correo)."],
    "Seu orçamento foi aberto no WhatsApp.": ["Your quote was opened in WhatsApp.", "Tu presupuesto se abrió en WhatsApp."],
    "Abrindo WhatsApp…": ["Opening WhatsApp…", "Abriendo WhatsApp…"],
    "Enviando…": ["Sending…", "Enviando…"],
    "Abrindo pedido no WhatsApp…": ["Opening order in WhatsApp…", "Abriendo pedido en WhatsApp…"],
    "Como preparar seu cachorro para a hospedagem em Birigui-SP": ["How to prepare your dog for boarding in Birigui-SP", "Cómo preparar a tu perro para el hospedaje en Birigui-SP"],
    "Passeios com cachorro em Araçatuba-SP: benefícios e cuidados": ["Dog walks in Araçatuba-SP: benefits and care", "Paseos con perros en Araçatuba-SP: beneficios y cuidados"],
    "Pet Sitter em domicílio": ["In-home pet sitter", "Pet sitter a domicilio"],
    "Nossos serviços": ["Our services", "Nuestros servicios"],
    "Nossos serviços em Birigui": ["Our services in Birigui", "Nuestros servicios en Birigui"],
    "Nossos serviços em Araçatuba": ["Our services in Araçatuba", "Nuestros servicios en Araçatuba"],
    "Pet Sitter em Birigui e Araçatuba-SP: amor e cuidado no seu lar": ["Pet sitter in Birigui and Araçatuba-SP: love and care in your home", "Pet sitter en Birigui y Araçatuba-SP: amor y cuidado en tu hogar"],
    "Visita em domicílio para o seu pet sem sair de casa": ["In-home care for your pet without leaving home", "Visita a domicilio para tu mascota sin salir de casa"],
    "Hospedagem para o seu pet com a família": ["Boarding for your pet with a family", "Hospedaje para tu mascota en familia"],
    "Passeio com o seu cão cheio de energia boa": ["A dog walk full of good energy", "Un paseo lleno de buena energía para tu perro"],
    "Cuidado completo na rotina do seu pet": ["Complete care in your pet's routine", "Cuidado completo en la rutina de tu mascota"],
    "Um cantinho cheio de cuidado": ["A cozy place full of care", "Un rincón lleno de cuidados"],
    "Exercício e diversão no pé certo": ["Exercise and fun at the right pace", "Ejercicio y diversión al ritmo adecuado"],
    "Cuidado para o seu pet do jeitinho dele": ["Care for your pet, just the way they like it", "Cuidado para tu mascota, a su manera"],
    "Alimentação e água fresca": ["Food and fresh water", "Comida y agua fresca"],
    "Medicação, se necessário": ["Medication, if needed", "Medicamentos, si es necesario"],
    "Fotos no fim de cada visita": ["Photos after every visit", "Fotos al final de cada visita"],
    "Ambiente familiar e seguro": ["Safe, family environment", "Ambiente familiar y seguro"],
    "Rotina de alimentação e passeios": ["Food and walking routine", "Rutina de comida y paseos"],
    "Fotos e resumo": ["Photos and a summary", "Fotos y resumen"],
    "Passeio com segurança": ["Safe walks", "Paseos seguros"],
    "Exercício e estimulação": ["Exercise and enrichment", "Ejercicio y estimulación"],
    "Atualizações diárias": ["Daily updates", "Actualizaciones diarias"],
    "Menos estresse": ["Less stress", "Menos estrés"],
    "Visita em domicílio é menos estresse para o pet": ["In-home visits mean less stress for your pet", "Las visitas a domicilio significan menos estrés para tu mascota"],
    "Hospedagem é peace of mind para você": ["Boarding means peace of mind for you", "El hospedaje te da tranquilidad"],
    "Passeio é saúde para o pet": ["Walks are healthy for pets", "Pasear es salud para tu mascota"],
    "Peça um orçamento de visita": ["Request a visit quote", "Pide un presupuesto de visita"],
    "Peça um orçamento de hospedagem": ["Request a boarding quote", "Pide un presupuesto de hospedaje"],
    "Peça um orçamento de passeio": ["Request a walking quote", "Pide un presupuesto de paseo"],
    "Área de atendimento: Birigui e Araçatuba-SP": ["Service area: Birigui and Araçatuba-SP", "Área de atención: Birigui y Araçatuba-SP"],
    "Área de atendimento em Birigui-SP": ["Service area in Birigui-SP", "Área de atención en Birigui-SP"],
    "Área de atendimento em Araçatuba-SP": ["Service area in Araçatuba-SP", "Área de atención en Araçatuba-SP"],
    "Pequenos cuidados fazem toda a diferença na hora de viajar ou deixar seu pet com um pet sitter. Confira:": ["Small details make all the difference when traveling or leaving your pet with a sitter. Take a look:", "Los pequeños cuidados marcan la diferencia al viajar o dejar tu mascota con un pet sitter. Mira:"],
    "Como preparar seu pet para a hospedagem": ["How to prepare your pet for boarding", "Cómo preparar a tu mascota para el hospedaje"],
    "Cuidados com o calor em Birigui e Araçatuba-SP": ["Hot-weather care in Birigui and Araçatuba-SP", "Cuidados con el calor en Birigui y Araçatuba-SP"],
    "Por que o passeio regular faz bem": ["Why regular walks are good for pets", "Por qué los paseos regulares son buenos"],
    "Você atende em toda Birigui e Araçatuba-SP?": ["Do you serve all of Birigui and Araçatuba-SP?", "¿Atiendes en todo Birigui y Araçatuba-SP?"],
    "Quais pets você aceita?": ["Which pets do you accept?", "¿Qué mascotas aceptas?"],
    "Como funciona a visita em domicílio?": ["How does an in-home visit work?", "¿Cómo funciona una visita a domicilio?"],
    "Meu cão precisa de medicação. Você administra?": ["My dog needs medication. Can you give it?", "Mi perro necesita medicamentos. ¿Puedes administrarlos?"],
    "Como reservo a hospedagem?": ["How do I book boarding?", "¿Cómo reservo el hospedaje?"],
    "Como funciona o passeio com o cão?": ["How does dog walking work?", "¿Cómo funciona el paseo con el perro?"],
    "Qual a forma de pagamento?": ["What payment methods are accepted?", "¿Cuál es la forma de pago?"],
    "1. Antecipe a adaptação": ["1. Prepare for the transition", "1. Anticipa la adaptación"],
    "2. Mantenha a rotina dele": ["2. Keep their routine", "2. Mantén su rutina"],
    "3. Deixe um objeto com seu cheiro": ["3. Leave an item with your scent", "3. Deja un objeto con tu olor"],
    "4. Medicamentos e cuidados especiais": ["4. Medication and special care", "4. Medicamentos y cuidados especiales"],
    "5. Fotos e tranquilidade para você": ["5. Photos and peace of mind for you", "5. Fotos y tranquilidad para ti"],
    "Reservar hospedagem": ["Book boarding", "Reservar hospedaje"],
    "Agendar passeio": ["Book a walk", "Agendar paseo"],
    "Ver página de Birigui": ["See the Birigui page", "Ver la página de Birigui"],
    "Agendar uma visita": ["Book a visit", "Agendar una visita"],
    "Pedir orçamento em Birigui": ["Request a quote in Birigui", "Pedir presupuesto en Birigui"],
    "Pedir orçamento em Araçatuba": ["Request a quote in Araçatuba", "Pedir presupuesto en Araçatuba"],
    "Casinha para cachorro grande N5": ["Large N5 dog house", "Casita N5 para perro grande"],
    "Casa de gato com rampa e arranhador": ["Cat house with ramp and scratcher", "Casa para gatos con rampa y rascador"],
    "Caixa de transporte para cães e gatos": ["Carrier for dogs and cats", "Transportadora para perros y gatos"],
    "Bolinha interativa inteligente recarregável": ["Rechargeable interactive smart ball", "Pelota interactiva inteligente recargable"],
    "Momentos de carinho e cuidado.": ["Moments of love and care.", "Momentos de cariño y cuidado."],
    "Cuidado com carinho em cada visita.": ["Care and affection on every visit.", "Cuidado y cariño en cada visita."],
    "Amanda Pet Sitter em Birigui e Araçatuba.": ["Amanda Pet Sitter in Birigui and Araçatuba.", "Amanda Pet Sitter en Birigui y Araçatuba."],
    "Tamanho para raça média. Feita de polipropileno impermeável, protege contra chuva em áreas externas e internas.": ["Medium-breed size. Made of waterproof polypropylene for indoor and outdoor protection from rain.", "Tamaño para razas medianas. Fabricada en polipropileno impermeable para proteger de la lluvia."],
    "Estrutura em MDF com carpete, com 30 cm de altura, 36 cm de largura e 47 cm de comprimento.": ["MDF structure with carpet, 30 cm high, 36 cm wide and 47 cm long.", "Estructura de MDF con alfombra, 30 cm de alto, 36 cm de ancho y 47 cm de largo."],
    "Com ventilação, suporta até 5 kg e mede 31 cm de largura por 44 cm de comprimento.": ["Ventilated carrier that holds up to 5 kg and measures 31 cm by 44 cm.", "Transportadora ventilada para hasta 5 kg, de 31 cm por 44 cm."],
    "Brinquedo em plástico para gatos e cachorros, ideal para estimular a diversão do pet.": ["Plastic toy for cats and dogs, ideal for playful enrichment.", "Juguete de plástico para gatos y perros, ideal para estimular la diversión."],
    "Esgotado": ["Sold out", "Agotado"],
    "Perfeito para o dia a dia e para quando você passa o dia fora. Vou até a sua casa cuidar do seu pet com toda a rotina, carinho e as atualizações com fotos que você adora.": ["Perfect for everyday life or days away. I come to your home to care for your pet with their full routine, affection and photo updates you will love.", "Perfecto para el día a día o cuando estás fuera. Voy a tu casa para cuidar a tu mascota con su rutina, cariño y las fotos que te encantan."],
    "Quando você viaja, seu cão ou gato fica acolhido em um ambiente familiar e seguro, com rotina, carinho e atualizações diárias com fotos. Você aproveita a viagem e ele fica tranquilo.": ["When you travel, your dog or cat stays in a safe, family environment with routine, affection and daily photo updates. You enjoy your trip while they stay relaxed.", "Cuando viajas, tu perro o gato se queda en un ambiente familiar y seguro, con rutina, cariño y fotos diarias. Tú disfrutas el viaje y él se queda tranquilo."],
    "Saídas para seu cachorro se exercitar, explorar o mundo e gastar energia com segurança — respeitando o porte e o ritmo dele. Você recebe fotos e um resuminho do passeio.": ["Walks for your dog to exercise, explore and safely spend energy, respecting their size and pace. You receive photos and a short walk summary.", "Paseos para que tu perro se ejercite, explore y gaste energía con seguridad, respetando su tamaño y ritmo. Recibes fotos y un breve resumen."],
    "Cada hóspede tem rotina de alimentação, passeios e descanso respeitados. Tudo pensado para ele se sentir em casa.": ["Every guest has their food, walking and rest routine respected. Everything is designed to feel like home.", "Respetamos la rutina de comida, paseos y descanso de cada huésped. Todo está pensado para que se sienta en casa."],
    "Passeios com coleira, água na volta e bastante brincadeira. Aceito cães de porte pequeno e grande. Atendo Birigui e Araçatuba-SP.": ["Leash walks, water afterward and plenty of play. I accept small and large dogs in Birigui and Araçatuba-SP.", "Paseos con correa, agua al volver y mucha diversión. Acepto perros pequeños y grandes en Birigui y Araçatuba-SP."],
    "Respeito a horários, porções e restrições alimentares. Seu pet come do jeitinho que você manda.": ["I follow schedules, portions and dietary restrictions. Your pet eats exactly as you instruct.", "Respeto horarios, porciones y restricciones alimentarias. Tu mascota come tal como indicas."],
    "Aplico ou administro remédios conforme orientação, com cuidado e registro para você ficar tranquilo.": ["I give medication according to your instructions, with care and records for your peace of mind.", "Administro medicamentos según tus indicaciones, con cuidado y registro para tu tranquilidad."],
    "Você recebe fotos e um resuminho do que rolou, para acompanhar de longe com a certeza de que está tudo bem.": ["You receive photos and a little summary, so you can follow along from afar knowing everything is fine.", "Recibes fotos y un pequeño resumen para acompañar desde lejos con la certeza de que todo está bien."],
    "Poucos hóspedes por vez, supervisão constante e espaço adaptado para cães e gatos.": ["Only a few guests at a time, constant supervision and a space adapted for dogs and cats.", "Pocos huéspedes a la vez, supervisión constante y un espacio adaptado para perros y gatos."],
    "Sigo horários, ração e cuidados especiais. Passeios diários para gastar energia com segurança.": ["I follow feeding times, food and special care instructions. Daily walks help them spend energy safely.", "Sigo horarios, comida y cuidados especiales. Paseos diarios para gastar energía con seguridad."],
    "Fotos e mensagens no WhatsApp para você acompanhar de pertinho, onde estiver.": ["Photos and WhatsApp messages so you can stay close, wherever you are.", "Fotos y mensajes por WhatsApp para que estés cerca, estés donde estés."],
    "Coleira e guia adequada, trajeto escolhido conforme o temperamento e a idade do cão.": ["The right collar and leash, with routes chosen for the dog's temperament and age.", "Correa y guía adecuadas, con rutas elegidas según el temperamento y la edad del perro."],
    "Corrida leve, cheiros novos e socialização — essencial para um pet equilibrado e feliz.": ["Light running, new smells and socialization - essential for a balanced, happy pet.", "Carrera suave, nuevos olores y socialización: esencial para una mascota equilibrada y feliz."],
    "Você recebe fotos do passeio e um resumo do que rolou, para acompanhar de perto.": ["You receive walk photos and a summary of what happened, so you can follow along.", "Recibes fotos del paseo y un resumen para acompañarlo de cerca."],
    "Aceita cães de porte pequeno e grande": ["Accepts small and large dogs", "Acepta perros pequeños y grandes"],
    "Medicação administrada conforme orientação": ["Medication given as instructed", "Medicamentos administrados según indicaciones"],
    "Gatos com área calma e separada": ["Cats have a calm, separate area", "Los gatos tienen un área tranquila y separada"],
    "Pacotes e valores a combinar conforme período": ["Packages and prices agreed according to the period", "Paquetes y precios a acordar según el período"],
    "Ideal para cães com energia de sobra": ["Ideal for energetic dogs", "Ideal para perros con mucha energía"],
    "Opção de passeio individual ou em dupla": ["Individual or paired walks available", "Paseo individual o en pareja"],
    "Hidratação e pausa na sombra quando faz calor": ["Water and shade breaks in hot weather", "Hidratación y pausas a la sombra cuando hace calor"],
    "Pacotes semanais para rotina de saúde": ["Weekly packages for a healthy routine", "Paquetes semanales para una rutina saludable"],
    "Sim! Atendo domicílios em Birigui-SP e Araçatuba-SP, e arredores próximos, conforme a disponibilidade de cada período. Para hospedagem, seu pet vem para a minha casa em Birigui.": ["Yes! I serve homes in Birigui-SP, Araçatuba-SP and nearby areas, depending on availability. For boarding, your pet stays at my home in Birigui.", "¡Sí! Atiendo domicilios en Birigui-SP, Araçatuba-SP y alrededores, según la disponibilidad. Para hospedaje, tu mascota viene a mi casa en Birigui."],
    "Cuido de cães e gatos. Aceito cães de porte pequeno e grande, sempre respeitando o temperamento e a rotina de cada um.": ["I care for dogs and cats. I accept small and large dogs, always respecting each pet's temperament and routine.", "Cuido perros y gatos. Acepto perros pequeños y grandes, respetando siempre el temperamento y la rutina de cada uno."],
    "Eu vou à sua casa nos horários combinados para alimentar, dar água fresca, administrar medicação se necessário, brincar e enviar fotos no fim de cada visita.": ["I come to your home at the agreed times to feed, provide fresh water, give medication if needed, play and send photos after each visit.", "Voy a tu casa en los horarios acordados para alimentar, dar agua fresca, administrar medicamentos si es necesario, jugar y enviar fotos al final de cada visita."],
    "Sim. Administro medicamentos conforme a sua orientação, com cuidado e registro, para você ficar tranquilo.": ["Yes. I give medication according to your instructions, with care and records for your peace of mind.", "Sí. Administro medicamentos según tus indicaciones, con cuidado y registro para tu tranquilidad."],
    "Pelo WhatsApp ou pelo formulário de orçamento, informando as datas e o porte do pet. As vagas são limitadas de propósito, então reserve com antecedência em feriados e férias.": ["Through WhatsApp or the quote form, sharing the dates and your pet's size. Places are intentionally limited, so book ahead for holidays and vacations.", "Por WhatsApp o mediante el formulario, indicando las fechas y el tamaño de tu mascota. Las plazas son limitadas, así que reserva con anticipación en feriados y vacaciones."],
    "Saídas com coleira e segurança, no ritmo e porte do seu cão, para exercício e diversão. Você recebe fotos e um resumo do passeio.": ["Safe leash walks at your dog's pace and size, for exercise and fun. You receive photos and a walk summary.", "Paseos seguros con correa, al ritmo y tamaño de tu perro, para ejercicio y diversión. Recibes fotos y un resumen."],
    "Combinamos diretamente no WhatsApp (em geral via Pix). O valor depende do serviço, período e necessidades do seu pet.": ["We arrange payment directly on WhatsApp, usually via Pix. The price depends on the service, period and your pet's needs.", "Acordamos el pago directamente por WhatsApp, normalmente por Pix. El precio depende del servicio, período y necesidades de tu mascota."],
    "Antecipe a adaptação com visitas curtas, deixe um objeto com seu cheiro (uma blusa velha) e passe todas as rotinas e manhas para quem vai cuidar. Pets mais seguros se ambientam melhor e estressam menos.": ["Prepare the transition with short visits, leave an item carrying your scent and share all routines with the caregiver. Confident pets adapt better and feel less stress.", "Anticipa la adaptación con visitas cortas, deja un objeto con tu olor y comparte las rutinas con quien cuidará de tu mascota. Las mascotas seguras se adaptan mejor y se estresan menos."],
    "Nos dias quentes, evite passeios no horário de pico e prefira manhã cedo ou fim de tarde. Ofereça água constantemente, procure sombra e fique de olho em sinais de cansaço excessivo. Pausas valem ouro.": ["On hot days, avoid peak walking hours and choose early morning or late afternoon. Offer water often, seek shade and watch for signs of exhaustion. Breaks matter.", "En días calurosos, evita las horas de más calor y prefiere temprano o al final de la tarde. Ofrece agua, busca sombra y observa señales de cansancio. Las pausas son esenciales."],
    "Cães que passeiam com frequência dormem melhor, têm menos ansiedade e comportamentos destrutivos. O exercício é saúde — e diversão na mesma dose. Combine passeios com a rotina dele.": ["Dogs who walk regularly sleep better and have less anxiety and destructive behavior. Exercise is health and fun in equal measure. Make walks part of their routine.", "Los perros que pasean con frecuencia duermen mejor y tienen menos ansiedad y conductas destructivas. El ejercicio es salud y diversión. Incluye paseos en su rutina."],
    "Adicionar": ["Add", "Añadir"],
    "Disponível": ["Available", "Disponible"],
  };

  const PAGINAS = {
    "/": ["Pet Sitter in Birigui and Araçatuba-SP | Visits, Boarding and Walks - Amanda", "Pet Sitter en Birigui y Araçatuba-SP | Visitas, hospedaje y paseos - Amanda"],
    "/faq.html": ["Frequently asked questions - Pet Sitter Amanda", "Preguntas frecuentes - Pet Sitter Amanda"],
    "/dicas.html": ["Tips for pet parents - Pet Sitter Amanda", "Consejos para tutores - Pet Sitter Amanda"],
    "/servicos/visita.html": ["In-home pet visits in Birigui and Araçatuba-SP - Amanda", "Visitas a domicilio en Birigui y Araçatuba-SP - Amanda"],
    "/servicos/hospedagem.html": ["Pet boarding in Birigui and Araçatuba-SP - Amanda", "Hospedaje para mascotas en Birigui y Araçatuba-SP - Amanda"],
    "/servicos/passeio.html": ["Dog walking in Birigui and Araçatuba-SP - Amanda", "Paseos con perros en Birigui y Araçatuba-SP - Amanda"],
    "/birigui.html": ["Pet sitter in Birigui-SP - Amanda", "Pet sitter en Birigui-SP - Amanda"],
    "/aracatuba.html": ["Pet sitter in Araçatuba-SP - Amanda", "Pet sitter en Araçatuba-SP - Amanda"],
    "/artigos/hospedagem-cachorro-birigui.html": ["How to prepare your dog for boarding in Birigui-SP - Amanda", "Cómo preparar a tu perro para el hospedaje en Birigui-SP - Amanda"],
    "/artigos/passeio-cachorro-aracatuba.html": ["Dog walks in Araçatuba-SP: benefits and care - Amanda", "Paseos con perros en Araçatuba-SP: beneficios y cuidados - Amanda"],
    "/404.html": ["Page not found - Pet Sitter Amanda", "Página no encontrada - Pet Sitter Amanda"],
  };

  function idiomaInicial() {
    try {
      const salvo = localStorage.getItem("idioma");
      if (salvo && IDIOMAS[salvo]) return salvo;
    } catch (_) {}
    const navegador = (navigator.language || "pt").toLowerCase();
    return navegador.startsWith("en") ? "en" : navegador.startsWith("es") ? "es" : "pt";
  }

  let idiomaAtual = idiomaInicial();
  const originaisElementos = new WeakMap();
  const originaisTextos = new WeakMap();
  const originaisAtributos = new WeakMap();

  function chave(texto) {
    return texto.replace(/\s+/g, " ").trim();
  }

  function traduzir(texto, idioma = idiomaAtual) {
    const entrada = CHAVES[chave(String(texto))];
    return idioma === "pt" || !entrada ? String(texto) : entrada[idioma === "en" ? 0 : 1];
  }

  function traduzirPagina() {
    document.documentElement.lang = idiomaAtual === "pt" ? "pt-BR" : idiomaAtual;
    document.querySelectorAll("h1,h2,h3,p,a,label,option,button,span,li,summary").forEach((elemento) => {
      if (elemento.closest("script, style") || elemento.classList.contains("marca-nome")) return;
      if (!originaisElementos.has(elemento)) originaisElementos.set(elemento, elemento.innerHTML);
      const texto = chave(elemento.textContent);
      const original = chave(elemento.innerHTML === originaisElementos.get(elemento) ? elemento.textContent : (elemento.dataset.textoOriginal || elemento.textContent));
      if (!elemento.dataset.textoOriginal) elemento.dataset.textoOriginal = original;
      if (!original || !CHAVES[original]) return;
      if (elemento.children.length && elemento.querySelector("svg")) return;
      elemento.innerHTML = idiomaAtual === "pt" ? originaisElementos.get(elemento) : traduzir(original);
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textos = [];
    while (walker.nextNode()) textos.push(walker.currentNode);
    textos.forEach((texto) => {
      if (texto.parentElement?.closest("script, style, .marca-nome")) return;
      if (!originaisTextos.has(texto)) originaisTextos.set(texto, texto.nodeValue || "");
      const original = chave(originaisTextos.get(texto));
      if (!original || !CHAVES[original]) return;
      const traduzido = idiomaAtual === "pt" ? originaisTextos.get(texto) : traduzir(original);
      texto.nodeValue = traduzido;
    });
    document.querySelectorAll("[placeholder]").forEach((elemento) => {
      if (!originaisAtributos.has(elemento)) originaisAtributos.set(elemento, elemento.placeholder);
      elemento.placeholder = idiomaAtual === "pt" ? originaisAtributos.get(elemento) : traduzir(originaisAtributos.get(elemento));
    });
    document.querySelectorAll("[aria-label]").forEach((elemento) => {
      if (!originaisAtributos.has(elemento)) originaisAtributos.set(elemento, elemento.getAttribute("aria-label"));
      const original = originaisAtributos.get(elemento);
      elemento.setAttribute("aria-label", idiomaAtual === "pt" ? original : traduzir(original));
    });
    const pagina = PAGINAS[window.location.pathname] || [];
    if (pagina.length && idiomaAtual !== "pt") document.title = pagina[idiomaAtual === "en" ? 0 : 1];
    const seletor = document.getElementById("seletor-idioma");
    if (seletor) seletor.value = idiomaAtual;
    document.dispatchEvent(new CustomEvent("idiomaalterado", { detail: { idioma: idiomaAtual } }));
  }

  function criarSeletor() {
    const alvo = document.querySelector(".cabecalho-inner");
    if (!alvo || document.getElementById("seletor-idioma")) return;
    const grupo = document.createElement("div");
    grupo.className = "idioma-controle";
    const label = document.createElement("label");
    label.className = "sr-only";
    label.htmlFor = "seletor-idioma";
    label.textContent = "Idioma";
    const seletor = document.createElement("select");
    seletor.id = "seletor-idioma";
    seletor.setAttribute("aria-label", "Idioma do site");
    Object.entries(IDIOMAS).forEach(([codigo, nome]) => {
      const opcao = document.createElement("option");
      opcao.value = codigo;
      opcao.textContent = nome;
      seletor.appendChild(opcao);
    });
    seletor.addEventListener("change", () => {
      idiomaAtual = seletor.value;
      try { localStorage.setItem("idioma", idiomaAtual); } catch (_) {}
      traduzirPagina();
    });
    grupo.append(label, seletor);
    const nav = alvo.querySelector("nav");
    alvo.insertBefore(grupo, nav || null);
  }

  window.traduzirSite = traduzir;
  window.idiomaSite = () => idiomaAtual;
  document.addEventListener("DOMContentLoaded", () => {
    criarSeletor();
    traduzirPagina();
  });
})();
