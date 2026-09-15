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

  const EXTRAS = {
    "Pular para o conteúdo": ["Skip to content", "Saltar al contenido"],
    "Abrir menu": ["Open menu", "Abrir menú"],
    "Navegação principal": ["Main navigation", "Navegación principal"],
    "Idioma": ["Language", "Idioma"],
    "Idioma do site": ["Site language", "Idioma del sitio"],
    "Alternar tema claro ou escuro": ["Switch light or dark theme", "Cambiar tema claro u oscuro"],
    "Abrir carrinho": ["Open cart", "Abrir carrito"],
    "Fechar carrinho": ["Close cart", "Cerrar carrito"],
    "Seu carrinho": ["Your cart", "Tu carrito"],
    "Contato direto": ["Direct contact", "Contacto directo"],
    "Ligar para a Amanda": ["Call Amanda", "Llamar a Amanda"],
    "Falar no WhatsApp": ["Chat on WhatsApp", "Hablar por WhatsApp"],
    "Fechar galeria": ["Close gallery", "Cerrar galería"],
    "Foto da Amanda": ["Photo of Amanda", "Foto de Amanda"],
    "Como posso te chamar?": ["What should I call you?", "¿Cómo te llamo?"],
    "Preciso de um contato para responder.": ["I need a contact to reply.", "Necesito un contacto para responder."],
    "Informe seu nome (mínimo 2 letras).": ["Enter your name (at least 2 letters).", "Escribe tu nombre (mínimo 2 letras)."],
    "Escolha a data de início.": ["Choose a start date.", "Elige la fecha de inicio."],
    "A data de fim não pode ser anterior à de início.": ["The end date cannot be before the start date.", "La fecha final no puede ser anterior a la inicial."],
    "Prefere conversar direito?": ["Would you rather talk directly?", "¿Prefieres hablar directamente?"],
    "Me chame no WhatsApp — respondo pessoalmente e com carinho.": ["Message me on WhatsApp - I reply personally and with care.", "Escríbeme por WhatsApp: respondo personalmente y con cariño."],
    "Vamos conversar?": ["Let's talk?", "¿Hablamos?"],
    "Me siga no Instagram": ["Follow me on Instagram", "Sígueme en Instagram"],
    "Pronto para agendar?": ["Ready to book?", "¿Listo para reservar?"],
    "Pronto para começar?": ["Ready to get started?", "¿Listo para comenzar?"],
    "Pronto para reservar?": ["Ready to book?", "¿Listo para reservar?"],
    "Pronto para sair?": ["Ready to go?", "¿Listo para salir?"],
    "Perfeita para o dia a dia": ["Perfect for everyday life", "Perfecta para el día a día"],
    "Ideal para viagens": ["Ideal for trips", "Ideal para viajes"],
    "Para rotina e diversão": ["For routine and fun", "Para rutina y diversión"],
    "Pacotes mensais disponíveis — tudo a combinar. É só me chamar no WhatsApp ou Instagram!": ["Monthly packages available - details to be arranged. Just message me on WhatsApp or Instagram!", "Paquetes mensuales disponibles: todo a combinar. ¡Escríbeme por WhatsApp o Instagram!"],
    "Atendimento em domicílio": ["In-home care", "Atención a domicilio"],
    "Rotina personalizada": ["Personalized routine", "Rutina personalizada"],
    "Atualizações com fotos": ["Updates with photos", "Actualizaciones con fotos"],
    "Dois jeitos de deixar seu pet": ["Two ways to keep your pet", "Dos formas de cuidar de tu mascota"],
    "Escolha o que combina com a sua rotina": ["Choose what fits your routine", "Elige lo que combina con tu rutina"],
    "Alguns dos meus": ["Some of my", "Algunos de mis"],
    "melhores clientes": ["best clients", "mejores clientes"],
    "Eles também curtem uma fotinha quando estão sob meus cuidados": ["They also enjoy a little photo while in my care", "También disfrutan una fotito cuando están bajo mi cuidado"],
    "Monte seu carrinho e finalize pelo WhatsApp.": ["Build your cart and check out through WhatsApp.", "Arma tu carrito y finaliza por WhatsApp."],
    "Produtos para o seu": ["Products for your", "Productos para tu"],
    "Preencha o formulário e eu retorno com valores e disponibilidade. Sem compromisso.": ["Fill out the form and I will reply with prices and availability. No obligation.", "Completa el formulario y responderé con precios y disponibilidad. Sin compromiso."],
    "Seu orçamento foi aberto no WhatsApp.": ["Your quote was opened in WhatsApp.", "Tu presupuesto se abrió en WhatsApp."],
    "Orçamento enviado com sucesso!": ["Quote sent successfully!", "¡Presupuesto enviado con éxito!"],
    "Vou ler sua mensagem e responder o quanto antes. Quer agilizar?": ["I will read your message and reply as soon as possible. Want to speed things up?", "Leeré tu mensaje y responderé lo antes posible. ¿Quieres agilizarlo?"],
    "Pedido enviado!": ["Order sent!", "¡Pedido enviado!"],
    "Vou conferir e te respondo pelo WhatsApp.": ["I will check it and reply on WhatsApp.", "Lo revisaré y te responderé por WhatsApp."],
    "Fechar": ["Close", "Cerrar"],
    "em estoque": ["in stock", "en stock"],
    "Diminuir quantidade": ["Decrease quantity", "Disminuir cantidad"],
    "Aumentar quantidade": ["Increase quantity", "Aumentar cantidad"],
    "Ex.: antibiótico 2x ao dia": ["E.g.: antibiotic twice a day", "Ej.: antibiótico 2 veces al día"],
    "Olá Amanda! Vi seu site e gostaria de mais informações.": ["Hello Amanda! I saw your website and would like more information.", "¡Hola Amanda! Vi tu sitio y me gustaría recibir más información."],
    "Olá Amanda! Quero agendar uma visita em domicílio.": ["Hello Amanda! I would like to book an in-home visit.", "¡Hola Amanda! Quiero agendar una visita a domicilio."],
    "Olá Amanda! Quero saber sobre visitas em domicílio.": ["Hello Amanda! I would like to learn about in-home visits.", "¡Hola Amanda! Quiero saber sobre las visitas a domicilio."],
    "Olá Amanda! Gostaria de um orçamento de visita em domicílio.": ["Hello Amanda! I would like a quote for an in-home visit.", "¡Hola Amanda! Me gustaría un presupuesto para una visita a domicilio."],
    "Olá Amanda! Quero reservar uma hospedagem.": ["Hello Amanda! I would like to book boarding.", "¡Hola Amanda! Quiero reservar un hospedaje."],
    "Olá Amanda! Quero reservar hospedagem para meu pet.": ["Hello Amanda! I would like to book boarding for my pet.", "¡Hola Amanda! Quiero reservar hospedaje para mi mascota."],
    "Olá Amanda! Gostaria de um orçamento de hospedagem.": ["Hello Amanda! I would like a boarding quote.", "¡Hola Amanda! Me gustaría un presupuesto de hospedaje."],
    "Olá Amanda! Quero agendar um passeio para meu cão.": ["Hello Amanda! I would like to book a walk for my dog.", "¡Hola Amanda! Quiero agendar un paseo para mi perro."],
    "Olá Amanda! Quero agendar passeios para meu cão.": ["Hello Amanda! I would like to book walks for my dog.", "¡Hola Amanda! Quiero agendar paseos para mi perro."],
    "Olá Amanda! Gostaria de um orçamento de passeio.": ["Hello Amanda! I would like a walking quote.", "¡Hola Amanda! Me gustaría un presupuesto de paseo."],
    "Olá Amanda! Tenho outras dúvidas sobre os serviços.": ["Hello Amanda! I have other questions about the services.", "¡Hola Amanda! Tengo otras dudas sobre los servicios."],
    "Olá Amanda! Quero saber mais sobre os cuidados com meu pet.": ["Hello Amanda! I would like to learn more about caring for my pet.", "¡Hola Amanda! Quiero saber más sobre los cuidados de mi mascota."],
    "Olá Amanda! Gostaria de um orçamento em Birigui.": ["Hello Amanda! I would like a quote in Birigui.", "¡Hola Amanda! Me gustaría un presupuesto en Birigui."],
    "Olá Amanda! Gostaria de um orçamento em Araçatuba.": ["Hello Amanda! I would like a quote in Araçatuba.", "¡Hola Amanda! Me gustaría un presupuesto en Araçatuba."],
    "Olá Amanda! Quero agendar passeios em Araçatuba.": ["Hello Amanda! I would like to book walks in Araçatuba.", "¡Hola Amanda! Quiero agendar paseos en Araçatuba."],
    "Olá Amanda! Quero reservar uma hospedagem em Birigui.": ["Hello Amanda! I would like to book boarding in Birigui.", "¡Hola Amanda! Quiero reservar un hospedaje en Birigui."],
    "Olá Amanda! Gostaria de um orçamento de hospedagem.": ["Hello Amanda! I would like a boarding quote.", "¡Hola Amanda! Me gustaría un presupuesto de hospedaje."],
    "Observações (opcional)": ["Notes (optional)", "Observaciones (opcional)"],
    "Seu nome": ["Your name", "Tu nombre"],
    "WhatsApp ou e-mail": ["WhatsApp or email", "WhatsApp o correo"],
    "Pet Sitter em domicílio": ["In-home pet sitter", "Pet sitter a domicilio"],
    "Todos os direitos reservados.": ["All rights reserved.", "Todos los derechos reservados."],
    "Blog": ["Blog", "Blog"],
    "Ops!": ["Oops!", "¡Ups!"],
    "A página que você procura sumiu ou mudou de endereço. Vamos te levar de volta para um lugar seguro:": ["The page you are looking for is gone or moved. Let us take you back somewhere safe:", "La página que buscas desapareció o cambió de dirección. Te llevaremos a un lugar seguro:"],
    "Me conta as datas, o endereço e o porte do pet que eu retorno com valores e disponibilidade.": ["Tell me the dates, address and pet size and I will reply with prices and availability.", "Cuéntame las fechas, la dirección y el tamaño de tu mascota y responderé con precios y disponibilidad."],
    "Sem compromisso.": ["No obligation.", "Sin compromiso."],
    "Confirmar no WhatsApp": ["Confirm on WhatsApp", "Confirmar por WhatsApp"],
    "Artigo": ["Article", "Artículo"],
    "Visitas em domicílio e hospedagem na casa da Amanda, com rotina personalizada, atenção individual e atualizações com fotos para você ficar tranquilo.": ["In-home visits and boarding at Amanda's home, with a personalized routine, individual attention and photo updates for your peace of mind.", "Visitas a domicilio y hospedaje en casa de Amanda, con rutina personalizada, atención individual y actualizaciones con fotos para tu tranquilidad."],
    "Sou pet sitter em Birigui-SP (e região, incluindo Araçatuba-SP) e cuido de cada pet como se fosse meu: com paciência, carinho e atenção aos detalhes da rotina de cada um.": ["I am a pet sitter in Birigui-SP and the surrounding area, including Araçatuba-SP, and care for every pet as if they were mine: with patience, affection and attention to each routine.", "Soy pet sitter en Birigui-SP y alrededores, incluida Araçatuba-SP, y cuido de cada mascota como si fuera mía: con paciencia, cariño y atención a su rutina."],
    "Você viaja ou passa o dia fora com a certeza de que seu melhor amigo está sendo bem cuidado — seja na sua casa, com as visitas em domicílio, seja na minha, na hospedagem.": ["You can travel or spend the day away knowing your best friend is well cared for, whether at your home through visits or at mine through boarding.", "Puedes viajar o pasar el día fuera sabiendo que tu mejor amigo está bien cuidado, ya sea en tu casa con visitas o en la mía con hospedaje."],
    "Escolha o que combina com a sua rotina — e com a do seu pet.": ["Choose what fits your routine and your pet's.", "Elige lo que combina con tu rutina y la de tu mascota."],
    "Atendo domicílios em Birigui-SP e em Araçatuba-SP para visitas, passeios e cuidados. A hospedagem acontece na casa da Amanda, em Birigui — tutores de Araçatuba podem trazer o pet tranquilos.": ["I serve homes in Birigui-SP and Araçatuba-SP for visits, walks and care. Boarding takes place at Amanda's home in Birigui; pet parents from Araçatuba can bring their pets with peace of mind.", "Atiendo domicilios en Birigui-SP y Araçatuba-SP para visitas, paseos y cuidados. El hospedaje es en casa de Amanda, en Birigui; los tutores de Araçatuba pueden traer a su mascota tranquilos."],
    "Preencha o formulário e eu retorno com valores e disponibilidade. Sem compromisso.": ["Fill out the form and I will reply with prices and availability. No obligation.", "Completa el formulario y responderé con precios y disponibilidad. Sin compromiso."],
    "Se possível, agende uma visita curta antes da hospedagem. Conhecer o cheiro, o ambiente e a pessoa que vai cuidar reduz muito a ansiedade do pet no dia da viagem.": ["If possible, schedule a short visit before boarding. Becoming familiar with the scent, environment and caregiver greatly reduces your pet's anxiety on the day of the trip.", "Si es posible, programa una visita corta antes del hospedaje. Conocer el olor, el ambiente y a quien cuidará reduce mucho la ansiedad de tu mascota."],
    "Anote horários de ração, quantidade, brincadeiras preferidas e qualquer manha. Pets se sentem seguros quando a rotina é respeitada — e eu sigo à risca o que você passar.": ["Write down feeding times, portions, favorite games and any quirks. Pets feel safe when their routine is respected, and I follow your instructions carefully.", "Anota horarios de comida, cantidades, juegos favoritos y cualquier costumbre. Las mascotas se sienten seguras cuando se respeta su rutina y sigo tus indicaciones."],
    "Uma blusa velha ou cobertinha ajuda o cão a sentir seu cheiro e dormir mais tranquilo na hospedagem.": ["An old shirt or small blanket helps your dog smell you and sleep more peacefully while boarding.", "Una camiseta vieja o una manta ayuda a tu perro a sentir tu olor y dormir más tranquilo durante el hospedaje."],
    "Se o pet usa medicação, leve com a dosagem certa e me explique o jeitinho de administrar. Na hospedagem em Birigui-SP eu mantenho o controle e te aviso se algo mudar.": ["If your pet takes medication, bring the correct dose and explain how to administer it. During boarding in Birigui-SP I keep track and let you know if anything changes.", "Si tu mascota usa medicamentos, trae la dosis correcta y explícame cómo administrarlos. Durante el hospedaje en Birigui-SP llevo el control y te aviso si algo cambia."],
    "Durante a hospedagem você recebe fotos e mensagens no WhatsApp. Viaje sabendo que ele está sendo cuidado com carinho.": ["During boarding you receive photos and WhatsApp messages. Travel knowing your pet is being cared for with affection.", "Durante el hospedaje recibirás fotos y mensajes por WhatsApp. Viaja sabiendo que tu mascota recibe cariño y cuidados."],
    "O passeio não é só xixi na rua: é saúde, diversão e equilíbrio. Veja por que incluir caminhadas na rotina do seu cão em Araçatuba-SP faz toda a diferença.": ["A walk is more than a bathroom break: it is health, fun and balance. See why adding walks to your dog's routine in Araçatuba-SP makes all the difference.", "El paseo no es solo hacer sus necesidades: es salud, diversión y equilibrio. Descubre por qué incluir caminatas en la rutina de tu perro en Araçatuba-SP marca la diferencia."],
    "Cães que passeiam regularmente mantêm o peso saudável, dormem melhor e têm menos problemas articulares. Em Araçatuba-SP o clima pede atenção aos horários — manhã cedo e fim de tarde são ideais.": ["Dogs who walk regularly maintain a healthy weight, sleep better and have fewer joint problems. In Araçatuba-SP, pay attention to the weather; early morning and late afternoon are ideal.", "Los perros que pasean regularmente mantienen un peso saludable, duermen mejor y tienen menos problemas articulares. En Araçatuba-SP, presta atención al clima; temprano y al final de la tarde son ideales."],
    "Energia acumulada vira comportamento destrutivo dentro de casa. O passeio gasta essa energia e acalma o pet, deixando-o mais equilibrado.": ["Pent-up energy becomes destructive behavior at home. Walks use that energy and calm your pet, helping them stay balanced.", "La energía acumulada se convierte en conducta destructiva en casa. El paseo gasta esa energía y calma a tu mascota, ayudándola a estar equilibrada."],
    "Cheiros novos, sons e outros cães exercitam o cérebro. Um pet estimulado é um pet feliz.": ["New smells, sounds and other dogs exercise the brain. A stimulated pet is a happy pet.", "Los olores nuevos, sonidos y otros perros ejercitan el cerebro. Una mascota estimulada es una mascota feliz."],
    "Na cidade, uso coleira e guia adequadas, respeito o temperamento e a idade do cão, e hidrato sempre que faz calor. Você recebe fotos e um resumo do passeio.": ["In the city, I use suitable collars and leashes, respect the dog's temperament and age, and provide water whenever it is hot. You receive photos and a walk summary.", "En la ciudad, uso collares y correas adecuadas, respeto el temperamento y la edad del perro y le doy agua cuando hace calor. Recibes fotos y un resumen del paseo."],
    "Birigui e Araçatuba-SP · Pet Sitter em domicílio": ["Birigui and Araçatuba-SP · In-home pet sitter", "Birigui y Araçatuba-SP · Pet sitter a domicilio"],
    "amor e cuidado no seu lar": ["love and care in your home", "amor y cuidado en tu hogar"],
    "Visitas em domicílio e hospedagem na casa da Amanda, com rotina personalizada, atenção individual e atualizações com fotos para você ficar tranquilo.": ["In-home visits and boarding at Amanda's home, with a personalized routine, individual attention and photo updates for your peace of mind.", "Visitas a domicilio y hospedaje en casa de Amanda, con rutina personalizada, atención individual y actualizaciones con fotos para tu tranquilidad."],
    "Foto da Amanda com um pet": ["Photo of Amanda with a pet", "Foto de Amanda con una mascota"],
    "Olá, eu sou a": ["Hi, I am", "Hola, soy"],
    "Rotina personalizada para cada pet": ["Personalized routine for every pet", "Rutina personalizada para cada mascota"],
    "Cuidado com alimentação e medicação": ["Food and medication care", "Cuidado con la alimentación y los medicamentos"],
    "Atualizações com fotos e vídeos": ["Updates with photos and videos", "Actualizaciones con fotos y videos"],
    "Ambiente seguro e carinhoso": ["Safe and caring environment", "Ambiente seguro y cariñoso"],
    "Com carinho, Amanda": ["With love, Amanda", "Con cariño, Amanda"],
    "Vamos conversar?": ["Let's talk", "¿Hablamos?"],
    "Me siga no Instagram": ["Follow me on Instagram", "Sígueme en Instagram"],
    "Dois jeitos de deixar seu pet muito bem cuidado": ["Two ways to keep your pet very well cared for", "Dos formas de cuidar muy bien a tu mascota"],
    "Escolha o que combina com a sua rotina — e com a do seu pet.": ["Choose what fits your routine and your pet's.", "Elige lo que combina con tu rutina y la de tu mascota."],
    "Vou até a sua casa nos horários combinados para cuidar do seu pet sem que ele precise sair do conforto dele.": ["I come to your home at the agreed times so your pet can be cared for without leaving their comfort.", "Voy a tu casa en los horarios acordados para cuidar a tu mascota sin que tenga que salir de su comodidad."],
    "Alimentação e água fresca": ["Food and fresh water", "Alimento y agua fresca"],
    "Brincadeiras e muito carinho": ["Playtime and lots of affection", "Juegos y mucho cariño"],
    "Fotos no final de cada visita": ["Photos after every visit", "Fotos al final de cada visita"],
    "Seu pet acolhido em um ambiente familiar, com atenção individual e toda a rotina de casa — viagem tranquila para você.": ["Your pet stays in a family environment with individual attention and a home routine, so you can travel peacefully.", "Tu mascota se queda en un ambiente familiar, con atención individual y la rutina de una casa, para que viajes tranquilo."],
    "Atenção individual a cada hóspede": ["Individual attention for every guest", "Atención individual para cada huésped"],
    "Vagas para hospedagem": ["Boarding spots available", "Lugares disponibles para hospedaje"],
    "Você me passa os horários e as necessidades, e eu sigo o que seu pet já está acostumado — sem estresse de mudança de ambiente.": ["You share the times and needs, and I follow what your pet is already used to, without the stress of changing environments.", "Me indicas los horarios y las necesidades, y sigo lo que tu mascota ya conoce, sin el estrés de cambiar de ambiente."],
    "Respeito a horários, porções e restrições alimentares. Seu pet come do jeitinho que você manda.": ["I respect schedules, portions and dietary restrictions. Your pet eats exactly as you instruct.", "Respeto horarios, porciones y restricciones alimentarias. Tu mascota come tal como indicas."],
    "Aplico ou administro remédios conforme orientação, com cuidado e registro para você ficar tranquilo.": ["I give medication as instructed, with care and records for your peace of mind.", "Administro medicamentos según tus indicaciones, con cuidado y registro para tu tranquilidad."],
    "Muitos cães e gatos ficam ansiosos longe de casa. A visita mantém cheiros, cantos e rotina familiares — e ainda poupa você de levar e buscar.": ["Many dogs and cats become anxious away from home. A visit keeps familiar scents, spaces and routines, and saves you from dropping them off and picking them up.", "Muchos perros y gatos se ponen ansiosos lejos de casa. La visita mantiene olores, rincones y rutinas conocidas, y te evita llevarlos y recogerlos."],
    "É ideal para idosos, pets com medo de carro, pós-operatórios ou simplesmente o dia a dia corrido em Birigui e Araçatuba-SP.": ["It is ideal for senior pets, pets afraid of cars, post-surgery recovery or simply busy days in Birigui and Araçatuba-SP.", "Es ideal para mascotas mayores, con miedo al coche, en recuperación posoperatoria o para los días ajetreados en Birigui y Araçatuba-SP."],
    "A base da Amanda fica em Birigui-SP, onde acontecem as visitas, os passeios e a hospedagem. Também atendo tutores de Araçatuba-SP (a hospedagem é aqui em Birigui — dá para trazer o pet tranquilo).": ["Amanda's base is in Birigui-SP, where visits, walks and boarding take place. I also serve pet parents from Araçatuba-SP; boarding is here in Birigui and bringing your pet is easy.", "La base de Amanda está en Birigui-SP, donde se realizan visitas, paseos y hospedaje. También atiendo a tutores de Araçatuba-SP; el hospedaje es aquí en Birigui y traer a tu mascota es fácil."],
    "Veja o que dá para fazer estando em Araçatuba-SP.": ["See what you can arrange from Araçatuba-SP.", "Mira lo que puedes contratar desde Araçatuba-SP."],
    "Vou até a sua casa em Araçatuba nos horários combinados para alimentar, dar água, medicação e carinho — sem o pet sair do conforto dele.": ["I come to your home in Araçatuba at the agreed times to provide food, water, medication and affection, without your pet leaving their comfort.", "Voy a tu casa en Araçatuba en los horarios acordados para dar comida, agua, medicamentos y cariño, sin que tu mascota salga de su comodidad."],
    "A hospedagem acontece na casa da Amanda, em Birigui-SP. Tutores de Araçatuba podem trazer o pet com tranquilidade para um ambiente familiar e fotos diárias.": ["Boarding takes place at Amanda's home in Birigui-SP. Pet parents from Araçatuba can bring their pets comfortably to a family environment with daily photos.", "El hospedaje es en casa de Amanda, en Birigui-SP. Los tutores de Araçatuba pueden traer a su mascota tranquilamente a un ambiente familiar con fotos diarias."],
    "Pet Sitter em Araçatuba-SP para o seu pet não ficar sozinho": ["Pet sitter in Araçatuba-SP so your pet is not alone", "Pet sitter en Araçatuba-SP para que tu mascota no esté sola"],
    "Pet Sitter em Birigui-SP com carinho e confiança": ["Pet sitter in Birigui-SP with care and trust", "Pet sitter en Birigui-SP con cariño y confianza"],
    "Visitas em domicílio, hospedagem na minha casa e passeios para cães e gatos. Seu pet cuidado como se fosse meu, com rotina personalizada e fotos para você ficar tranquilo — seja na sua casa ou na minha.": ["In-home visits, boarding at my home and walks for dogs and cats. Your pet is cared for as if they were mine, with a personalized routine and photos for your peace of mind, whether at your home or mine.", "Visitas a domicilio, hospedaje en mi casa y paseos para perros y gatos. Cuido a tu mascota como si fuera mía, con rutina personalizada y fotos para tu tranquilidad, ya sea en tu casa o en la mía."],
    "Seu pet acolhido em ambiente familiar em Birigui, com rotina, passeios e fotos diárias. Ideal para quando você viaja.": ["Your pet stays in a family environment in Birigui, with routine, walks and daily photos. Ideal when you travel.", "Tu mascota se queda en un ambiente familiar en Birigui, con rutina, paseos y fotos diarias. Ideal cuando viajas."],
    "1. Exercício é saúde": ["1. Exercise is health", "1. El ejercicio es salud"],
    "2. Menos ansiedade e destruição": ["2. Less anxiety and destruction", "2. Menos ansiedad y destrucción"],
    "4. Segurança acima de tudo": ["4. Safety above all", "4. La seguridad ante todo"],
    "Viajar é bom, mas deixar o pet preocupa. Aqui vão dicas para a hospedagem do seu cão na casa da Amanda ser tranquila — para ele e para você.": ["Traveling is great, but leaving your pet can be worrying. Here are tips to make your dog's stay at Amanda's home calm for both of you.", "Viajar es bueno, pero dejar a tu mascota preocupa. Aquí tienes consejos para que la estancia de tu perro en casa de Amanda sea tranquila para ambos."],
    "Anote horários de ração, quantidade, brincadeiras preferidas e qualquer manha. Pets se sentem seguros quando a rotina é respeitada — e eu sigo à risca o que você passar.": ["Write down feeding times, portions, favorite games and any quirks. Pets feel safe when their routine is respected, and I follow your instructions carefully.", "Anota horarios de comida, cantidades, juegos favoritos y cualquier costumbre. Las mascotas se sienten seguras cuando se respeta su rutina y sigo tus indicaciones."],
    "Uma blusa velha ou cobertinha ajuda o cão a sentir seu cheiro e dormir mais tranquilo na hospedagem.": ["An old shirt or small blanket helps your dog smell you and sleep more peacefully while boarding.", "Una camiseta vieja o una manta ayuda a tu perro a sentir tu olor y dormir más tranquilo durante el hospedaje."],
    "Se o pet usa medicação, leve com a dosagem certa e me explique o jeitinho de administrar. Na hospedagem em Birigui-SP eu mantenho o controle e te aviso se algo mudar.": ["If your pet takes medication, bring the correct dose and explain how to give it. During boarding in Birigui-SP I keep track and let you know if anything changes.", "Si tu mascota usa medicamentos, trae la dosis correcta y explícame cómo administrarlos. Durante el hospedaje en Birigui-SP llevo el control y te aviso si algo cambia."],
    "Durante a hospedagem você recebe fotos e mensagens no WhatsApp. Viaje sabendo que ele está sendo cuidado com carinho.": ["During boarding you receive photos and WhatsApp messages. Travel knowing your pet is being cared for with affection.", "Durante el hospedaje recibirás fotos y mensajes por WhatsApp. Viaja sabiendo que tu mascota recibe cariño y cuidados."],
    "O passeio não é só xixi na rua: é saúde, diversão e equilíbrio. Veja por que incluir caminhadas na rotina do seu cão em Araçatuba-SP faz toda a diferença.": ["A walk is more than a bathroom break: it is health, fun and balance. See why adding walks to your dog's routine in Araçatuba-SP makes all the difference.", "El paseo no es solo hacer sus necesidades: es salud, diversión y equilibrio. Descubre por qué incluir caminatas en la rutina de tu perro en Araçatuba-SP marca la diferencia."],
    "Conheça o passeio com cachorro em Araçatuba-SP": ["Learn about dog walks in Araçatuba-SP", "Conoce los paseos con perros en Araçatuba-SP"],
    "página da Amanda em Araçatuba": ["Amanda's Araçatuba page", "página de Amanda en Araçatuba"],
    "Agende pelo WhatsApp!": ["Book through WhatsApp!", "¡Reserva por WhatsApp!"],
    "Energia acumulada vira comportamento destrutivo dentro de casa. O passeio gasta essa energia e acalma o pet, deixando-o mais equilibrado.": ["Pent-up energy becomes destructive behavior at home. Walks use that energy and calm your pet, helping them stay balanced.", "La energía acumulada se convierte en conducta destructiva en casa. El paseo gasta esa energía y calma a tu mascota, ayudándola a estar equilibrada."],
    "Cheiros novos, sons e outros cães exercitam o cérebro. Um pet estimulado é um pet feliz.": ["New smells, sounds and other dogs exercise the brain. A stimulated pet is a happy pet.", "Los olores nuevos, sonidos y otros perros ejercitan el cerebro. Una mascota estimulada es una mascota feliz."],
    "Cães que passeiam regularmente mantêm o peso saudável, dormem melhor e têm menos problemas articulares. Em Araçatuba-SP o clima pede atenção aos horários — manhã cedo e fim de tarde são ideais.": ["Dogs who walk regularly maintain a healthy weight, sleep better and have fewer joint problems. In Araçatuba-SP, pay attention to the weather; early morning and late afternoon are ideal.", "Los perros que pasean regularmente mantienen un peso saludable, duermen mejor y tienen menos problemas articulares. En Araçatuba-SP, presta atención al clima; temprano y al final de la tarde son ideales."],
    "Na cidade, uso coleira e guia adequadas, respeito o temperamento e a idade do cão, e hidrato sempre que faz calor. Você recebe fotos e um resumo do passeio.": ["In the city, I use suitable collars and leashes, respect the dog's temperament and age, and provide water whenever it is hot. You receive photos and a walk summary.", "En la ciudad, uso collares y correas adecuadas, respeto el temperamento y la edad del perro y le doy agua cuando hace calor. Recibes fotos y un resumen del paseo."],
    "Passeios agendados": ["Walks by appointment", "Paseos con cita previa"],
    "Atendo em Araçatuba-SP": ["I serve Araçatuba-SP", "Atiendo en Araçatuba-SP"],
    "Cuidado para o seu pet perto de você": ["Care for your pet close to you", "Cuidado para tu mascota cerca de ti"],
    "Saídas seguras em Araçatuba para seu cão se exercitar e gastar energia, no ritmo e porte dele, com fotos do passeio.": ["Safe walks in Araçatuba for your dog to exercise and spend energy at their pace and size, with walk photos.", "Paseos seguros en Araçatuba para que tu perro se ejercite y gaste energía a su ritmo y tamaño, con fotos del paseo."],
    "Atendo visitas e passeios em Araçatuba-SP. A hospedagem é na casa da Amanda, em Birigui-SP (sede) — trazer o pet de Araçatuba para a hospedagem é super tranquilo.": ["I offer visits and walks in Araçatuba-SP. Boarding is at Amanda's home in Birigui-SP; bringing your pet from Araçatuba is easy and stress-free.", "Ofrezco visitas y paseos en Araçatuba-SP. El hospedaje es en casa de Amanda, en Birigui-SP; traer a tu mascota desde Araçatuba es fácil y tranquilo."],
    "Me conta as datas, o endereço e o porte do pet que eu retorno com valores e disponibilidade.": ["Tell me the dates, address and pet size and I will reply with prices and availability.", "Cuéntame las fechas, la dirección y el tamaño de tu mascota y responderé con precios y disponibilidad."],
    "Quando você viaja, seu cão ou gato fica acolhido em um ambiente familiar e seguro, com rotina, carinho e atualizações diárias com fotos. Você aproveita a viagem e ele fica tranquilo.": ["When you travel, your dog or cat stays in a safe, family environment with routine, affection and daily photo updates. You enjoy your trip while they stay relaxed.", "Cuando viajas, tu perro o gato se queda en un ambiente familiar y seguro, con rutina, cariño y fotos diarias. Tú disfrutas el viaje y él se queda tranquilo."],
    "Em vez de deixar o pet sozinho por longos períodos ou com estranhos, ele fica com quem já conhece o jeitinho dele. Você viaja e recebe notícias diárias. Tutores de Araçatuba-SP podem trazer o pet para a hospedagem em Birigui com tranquilidade.": ["Instead of leaving your pet alone for long periods or with strangers, they stay with someone who knows them. You travel and receive daily updates. Pet parents from Araçatuba-SP can bring their pets to boarding in Birigui with peace of mind.", "En lugar de dejar a tu mascota sola durante mucho tiempo o con desconocidos, se queda con alguien que ya conoce su manera de ser. Viajas y recibes noticias diarias. Los tutores de Araçatuba-SP pueden traer a su mascota al hospedaje en Birigui con tranquilidad."],
    "Reserve com antecedência nos feriados e férias — as vagas são limitadas de propósito.": ["Book ahead for holidays and vacations; spaces are intentionally limited.", "Reserva con anticipación para feriados y vacaciones; los lugares son limitados a propósito."],
    "Me diga as datas e o porte do pet que eu retorno com disponibilidade e valores.": ["Tell me the dates and your pet's size and I will reply with availability and prices.", "Dime las fechas y el tamaño de tu mascota y responderé con disponibilidad y precios."],
    "Cães que se exercitam regularmente dormem melhor, têm menos ansiedade e comportamentos destrutivos. O passeio é diversão e bem-estar na mesma dose.": ["Dogs that exercise regularly sleep better and have less anxiety and destructive behavior. Walks bring fun and well-being in equal measure.", "Los perros que hacen ejercicio regularmente duermen mejor y tienen menos ansiedad y conductas destructivas. El paseo aporta diversión y bienestar por igual."],
    "Combina perfeitamente com a visita em domicílio ou a hospedagem — posso incluir passeios na rotina dele.": ["It pairs perfectly with in-home visits or boarding; I can include walks in their routine.", "Combina perfectamente con la visita a domicilio o el hospedaje; puedo incluir paseos en su rutina."],
    "Me conta porte, idade e frequência desejada que eu retorno com valores.": ["Tell me your pet's size, age and desired frequency and I will reply with prices.", "Cuéntame el tamaño, la edad y la frecuencia deseada y responderé con precios."],
    "Pular para o conteúdo": ["Skip to content", "Saltar al contenido"],
    "Pet Sitter em Birigui": ["Pet sitter in Birigui", "Pet sitter en Birigui"],
    "Pet Sitter em Araçatuba": ["Pet sitter in Araçatuba", "Pet sitter en Araçatuba"],
    "Artigo: hospedagem em Birigui": ["Article: boarding in Birigui", "Artículo: hospedaje en Birigui"],
    "Artigo: passeio em Araçatuba": ["Article: walking in Araçatuba", "Artículo: paseo en Araçatuba"],
    "Hospedagem em Birigui (artigo)": ["Boarding in Birigui (article)", "Hospedaje en Birigui (artículo)"],
    "Tenha em mãos: as datas de que precisa, endereço e o porte do seu pet.": ["Have these ready: the dates you need, your address and your pet's size.", "Ten a mano: las fechas que necesitas, la dirección y el tamaño de tu mascota."],
    "Como posso te chamar?": ["What should I call you?", "¿Cómo te llamo?"],
    "Conte sobre seu pet: porte, idade, rotina, cuidados especiais…": ["Tell me about your pet: size, age, routine and special care…", "Cuéntame sobre tu mascota: tamaño, edad, rutina y cuidados especiales…"],
    "Pedir orçamento": ["Request a quote", "Pedir presupuesto"],
    "Fechar carrinho": ["Close cart", "Cerrar carrito"],
    "Fechar": ["Close", "Cerrar"],
    "3. Estimulação mental": ["3. Mental stimulation", "3. Estimulación mental"],
    "Alguns dos meus": ["Some of my", "Algunos de mis"],
    "melhores clientes": ["best clients", "mejores clientes"],
    "feliz e tranquilo": ["happy and calm", "feliz y tranquilo"],
    "cheio de energia boa": ["full of good energy", "lleno de buena energía"],
    "no pé certo": ["at the right pace", "al ritmo adecuado"],
    "perto de você": ["close to you", "cerca de ti"],
    "sem sair de casa": ["without leaving home", "sin salir de casa"],
    "menos estresse": ["less stress", "menos estrés"],
    "Página não": ["Page not", "Página no"],
    "encontrada": ["found", "encontrada"],
    "Disponível para visitas": ["Visits available", "Visitas disponibles"],
    "Tenha em mãos": ["Have these ready", "Ten a mano"],
    "Atendemos": ["We serve", "Atendemos"],
    "A hospedagem acontece na casa da Amanda": ["Boarding takes place at Amanda's home", "El hospedaje es en casa de Amanda"],
    "tutores de Araçatuba podem trazer o pet tranquilos": ["pet parents from Araçatuba can bring their pets with peace of mind", "los tutores de Araçatuba pueden traer a su mascota tranquilos"],
    "Brincadeiras e carinho para não passar vontade": ["Playtime and affection so they do not miss out", "Juegos y cariño para que no eche de menos"],
    "Troca de água, limpeza da vasilha e da caixa de areia": ["Fresh water, bowl and litter-box cleaning", "Cambio de agua, limpieza del recipiente y de la caja de arena"],
    "Passeio de necessidade (banheiro) incluído": ["Bathroom walk included", "Paseo para hacer sus necesidades incluido"],
    "Atualização via WhatsApp sempre que você quiser": ["WhatsApp updates whenever you want", "Actualizaciones por WhatsApp cuando quieras"],
    "Vagas para hospedagem": ["Boarding spots available", "Lugares disponibles para hospedaje"],
  };
  Object.assign(CHAVES, EXTRAS);
  const PALAVRAS = {
    "e": ["and", "y"], "em": ["in", "en"], "para": ["for", "para"], "com": ["with", "con"], "sem": ["without", "sin"],
    "o": ["the", "el"], "a": ["the", "la"], "os": ["the", "los"], "as": ["the", "las"], "um": ["a", "un"], "uma": ["a", "una"],
    "seu": ["your", "tu"], "sua": ["your", "tu",], "seus": ["your", "tus"], "suas": ["your", "tus"], "do": ["of the", "del"], "da": ["of the", "de la"],
    "que": ["that", "que"], "não": ["not", "no"], "mais": ["more", "más"], "de": ["of", "de"], "no": ["in the", "en el"], "na": ["in the", "en la"],
    "para": ["for", "para"], "pet": ["pet", "mascota"], "pets": ["pets", "mascotas"], "cuidado": ["care", "cuidado"], "cuidados": ["care", "cuidados"],
    "com carinho": ["with care", "con cariño"], "disponível": ["available", "disponible"], "em domicílio": ["in-home", "a domicilio"],
    "visita": ["visit", "visita"], "visitas": ["visits", "visitas"], "hospedagem": ["boarding", "hospedaje"], "passeio": ["walk", "paseo"], "passeios": ["walks", "paseos"],
    "cachorro": ["dog", "perro"], "cachorros": ["dogs", "perros"], "cão": ["dog", "perro"], "cães": ["dogs", "perros"], "gato": ["cat", "gato"], "gatos": ["cats", "gatos"],
    "casa": ["home", "casa"], "família": ["family", "familia"], "familiar": ["family", "familiar"], "seguro": ["safe", "seguro"], "segurança": ["safety", "seguridad"],
    "amor": ["love", "amor"], "rotina": ["routine", "rutina"], "alimentação": ["feeding", "alimentación"], "medicação": ["medication", "medicación"], "fotos": ["photos", "fotos"],
    "diárias": ["daily", "diarias"], "diário": ["daily", "diario"], "atendimento": ["service", "atención"], "atendo": ["serve", "atiendo"], "tutores": ["pet parents", "tutores"],
    "dúvidas": ["questions", "dudas"], "perguntas": ["questions", "preguntas"], "frequentes": ["frequent", "frecuentes"], "como": ["how", "cómo"], "por": ["by", "por"], "porque": ["why", "por qué"],
    "benefícios": ["benefits", "beneficios"], "cuidados": ["care", "cuidados"], "saúde": ["health", "salud"], "exercício": ["exercise", "ejercicio"], "energia": ["energy", "energía"],
    "artigo": ["article", "artículo"], "artigos": ["articles", "artículos"], "dicas": ["tips", "consejos"], "leitura": ["reading", "lectura"], "rápida": ["quick", "rápida"],
    "enviado": ["sent", "enviado"], "sucesso": ["success", "éxito"], "mensagem": ["message", "mensaje"], "pedido": ["order", "pedido"], "orçamento": ["quote", "presupuesto"],
    "reservar": ["book", "reservar"], "agendar": ["schedule", "agendar"], "conhecer": ["explore", "conocer"], "página": ["page", "página"], "início": ["home", "inicio"],
    "pet sitter": ["pet sitter", "pet sitter"], "profissional": ["professional", "profesional"], "atendendo": ["serving", "atendiendo"], "hospedado": ["boarding", "hospedado"],
    "cuidando": ["caring for", "cuidando"], "trazer": ["bring", "traer"], "tranquilo": ["at ease", "tranquilo"], "tranquilidade": ["peace of mind", "tranquilidad"],
    "cidade": ["city", "ciudad"], "região": ["area", "región"], "casa": ["home", "casa"], "endereço": ["address", "dirección"], "forma": ["method", "forma"], "pagamento": ["payment", "pago"],
    "período": ["period", "período"], "necessidades": ["needs", "necesidades"], "medicamentos": ["medications", "medicamentos"], "regular": ["regular", "regular"], "calor": ["heat", "calor"],
    "eu": ["I", "yo"], "sou": ["am", "soy"], "vou": ["go", "voy"], "até": ["to", "hasta"], "você": ["you", "tú"], "vocês": ["you", "ustedes"],
    "melhor": ["better", "mejor"], "melhores": ["best", "mejores"], "cliente": ["client", "cliente"], "clientes": ["clients", "clientes"], "feliz": ["happy", "feliz"],
    "tranquilo": ["at ease", "tranquilo"], "tranquilos": ["at ease", "tranquilos"], "cheio": ["full", "lleno"], "cheia": ["full", "llena"], "boa": ["good", "buena"],
    "perto": ["close", "cerca"], "sair": ["leave", "salir"], "fora": ["away", "fuera"], "quando": ["when", "cuando"], "fica": ["stays", "queda"], "ficar": ["stay", "quedarse"],
    "acolhido": ["welcomed", "acogido"], "acolhidos": ["welcomed", "acogidos"], "toda": ["the whole", "toda"], "atenção": ["attention", "atención"], "individual": ["individual", "individual"],
    "viagem": ["trip", "viaje"], "viaja": ["travel", "viajas"], "viajar": ["travel", "viajar"], "horários": ["times", "horarios"], "combinados": ["agreed", "acordados"], "necessário": ["needed", "necesario"],
    "brincadeiras": ["playtime", "juegos"], "muito": ["lots of", "mucho"], "final": ["end", "final"], "cada": ["every", "cada"], "perfeita": ["perfect", "perfecta"], "ideal": ["ideal", "ideal"],
    "preparar": ["prepare", "preparar"], "prepara": ["prepare", "prepara"], "adaptação": ["transition", "adaptación"], "calor": ["heat", "calor"], "dias": ["days", "días"], "manhã": ["morning", "mañana"], "cedo": ["early", "temprano"],
    "tarde": ["afternoon", "tarde"], "ofereça": ["offer", "ofrece"], "água": ["water", "agua"], "sombra": ["shade", "sombra"], "olho": ["watch", "ojo"], "sinais": ["signs", "señales"], "cansaço": ["tiredness", "cansancio"],
    "excesso": ["excessive", "excesivo"], "pausas": ["breaks", "pausas"], "faz": ["makes", "hace"], "bem": ["well", "bien"], "frequência": ["frequency", "frecuencia"], "frequente": ["frequent", "frecuente"],
    "energia": ["energy", "energía"], "gastar": ["spend", "gastar"], "explorar": ["explore", "explorar"], "mundo": ["world", "mundo"], "respeitando": ["respecting", "respetando"], "ritmo": ["pace", "ritmo"],
    "idade": ["age", "edad"], "segundo": ["second", "segundo"], "incluindo": ["including", "incluyendo"], "também": ["also", "también"], "região": ["area", "región"], "arredores": ["surrounding areas", "alrededores"],
    "disponibilidade": ["availability", "disponibilidad"], "perguntas": ["questions", "preguntas"], "respostas": ["answers", "respuestas"], "reservas": ["bookings", "reservas"], "vagas": ["spots", "lugares"], "limitadas": ["limited", "limitadas"],
    "acompanhado": ["followed", "acompañado"], "acompanhar": ["follow", "acompañar"], "conhece": ["knows", "conoce"], "conhecer": ["get to know", "conocer"], "deixe": ["leave", "deja"], "objeto": ["item", "objeto"],
    "cheiro": ["scent", "olor"], "manhas": ["quirks", "costumbres"], "alguém": ["someone", "alguien"], "sozinho": ["alone", "solo"], "longos": ["long", "largos"], "estranhos": ["strangers", "desconocidos"], "notícias": ["updates", "noticias"],
    "dizer": ["tell", "decir"], "conte": ["tell me", "cuéntame"], "conta": ["tell me", "cuéntame"], "endereço": ["address", "dirección"], "retorno": ["reply", "responderé"], "valores": ["prices", "precios"], "preço": ["price", "precio"],
    "confira": ["check it out", "mira"], "conforme": ["according to", "según"], "forma": ["method", "forma"], "poucos": ["few", "pocos"], "sempre": ["always", "siempre"], "seguro": ["safe", "seguro"], "segura": ["safe", "segura"],
    "agora": ["now", "ahora"], "antes": ["before", "antes"], "depois": ["after", "después"], "sobre": ["about", "sobre"], "sem": ["without", "sin"], "tudo": ["everything", "todo"], "só": ["just", "solo"], "mais": ["more", "más"],
    "olá": ["hello", "hola"], "Olá": ["Hello", "Hola"], "vi": ["saw", "vi"], "site": ["website", "sitio"], "gostaria": ["would like", "me gustaría"], "Gostaria": ["Would like", "Me gustaría"], "quero": ["want", "quiero"], "Quero": ["Want", "Quiero"], "informação": ["information", "información"], "informações": ["information", "información"],
    "saber": ["learn", "saber"], "outras": ["other", "otras"], "dúvida": ["question", "duda"], "dúvidas": ["questions", "dudas"], "serviços": ["services", "servicios"], "serviço": ["service", "servicio"], "reservar": ["book", "reservar"], "agendar": ["book", "agendar"], "agende": ["book", "reserva"], "pedido": ["order", "pedido"],
    "práticas": ["practical", "prácticos"], "prático": ["practical", "práctico"], "comportamento": ["behavior", "comportamiento"], "comportamentos": ["behaviors", "comportamientos"], "confiança": ["trust", "confianza"], "preocupação": ["worry", "preocupación"], "preocupa": ["worries", "preocupa"], "pessoalmente": ["personally", "personalmente"], "respondo": ["reply", "respondo"], "responder": ["reply", "responder"],
    "passa": ["share", "indicas"], "sigo": ["follow", "sigo"], "acostumado": ["used to", "acostumbrado"], "registro": ["records", "registro"], "jeitinho": ["way", "manera"], "notícias": ["updates", "noticias"], "feriados": ["holidays", "feriados"], "férias": ["vacations", "vacaciones"], "porções": ["portions", "porciones"], "restrições": ["restrictions", "restricciones"], "alimentares": ["dietary", "alimentarias"], "hidratação": ["hydration", "hidratación"], "pausa": ["break", "pausa"], "sombra": ["shade", "sombra"], "conforto": ["comfort", "comodidad"], "conhece": ["knows", "conoce"], "conhecer": ["get to know", "conocer"],
    "encontrada": ["found", "encontrada"], "destruição": ["destruction", "destrucción"], "segurança": ["safety", "seguridad"], "alimentação": ["feeding", "alimentación"], "administro": ["administer", "administro"], "administra": ["administer", "administra"], "medicação": ["medication", "medicación"], "dosagem": ["dosage", "dosis"], "incluída": ["included", "incluida"], "incluído": ["included", "incluido"], "preferidas": ["favorite", "favoritos"],
    "por que": ["why", "por qué"], "pet sitting": ["pet sitting", "cuidado de mascotas"], "cães e gatos": ["dogs and cats", "perros y gatos"], "para cães e gatos": ["for dogs and cats", "para perros y gatos"], "passeio regular": ["regular walks", "paseo regular"], "faz bem": ["is beneficial", "hace bien"], "Leitura rápida": ["Quick read", "Lectura rápida"], "Tire suas dúvidas": ["Get your questions answered", "Resuelve tus dudas"], "atendimento de qualidade": ["quality service", "atención de calidad"], "cuidar": ["care for", "cuidar"], "cuidando": ["caring for", "cuidando"], "cão passeando": ["dog walking", "perro paseando"], "na minha casa": ["at my home", "en mi casa"], "na sua casa": ["at your home", "en tu casa"], "a minha": ["mine", "la mía"], "a sua": ["yours", "la tuya"],
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
  const originaisTextos = new WeakMap();
  const originaisAtributos = new Map();

  function chave(texto) { return String(texto).replace(/\s+/g, " ").trim(); }

  function traduzirTexto(texto, idioma = idiomaAtual) {
    const original = String(texto);
    if (idioma === "pt" || !original.trim()) return original;
    const direto = CHAVES[chave(original)];
    if (direto) return direto[idioma === "en" ? 0 : 1];
    let resultado = Object.keys(CHAVES).sort((a, b) => b.length - a.length).reduce((valor, termo) => {
      const traducao = CHAVES[termo][idioma === "en" ? 0 : 1];
      return valor.split(termo).join(traducao);
    }, original);
    Object.keys(PALAVRAS).sort((a, b) => b.length - a.length).forEach((termo) => {
      const traducao = PALAVRAS[termo][idioma === "en" ? 0 : 1];
      resultado = resultado.replace(new RegExp(`(^|[^\\p{L}])${termo}(?=$|[^\\p{L}])`, "giu"), `$1${traducao}`);
    });
    return resultado;
  }

  function traduzir(texto, idioma = idiomaAtual) {
    return traduzirTexto(texto, idioma);
  }

  function traduzirPagina() {
    document.documentElement.lang = idiomaAtual === "pt" ? "pt-BR" : idiomaAtual;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textos = [];
    while (walker.nextNode()) textos.push(walker.currentNode);
    textos.forEach((texto) => {
      if (texto.parentElement?.closest("script, style, .marca-nome")) return;
      if (!originaisTextos.has(texto)) originaisTextos.set(texto, texto.nodeValue || "");
       texto.nodeValue = traduzirTexto(originaisTextos.get(texto));
    });
    document.querySelectorAll("[placeholder],[title],[alt],[aria-label]").forEach((elemento) => {
      ["placeholder", "title", "alt", "aria-label"].forEach((atributo) => {
        if (!elemento.hasAttribute(atributo)) return;
        const chaveAtributo = `${atributo}:${elemento.getAttribute(atributo)}`;
        if (!originaisAtributos.has(chaveAtributo)) originaisAtributos.set(chaveAtributo, elemento.getAttribute(atributo));
        elemento.setAttribute(atributo, traduzirTexto(originaisAtributos.get(chaveAtributo)));
      });
    });
    document.querySelectorAll("meta[name='description'],meta[property^='og:'],meta[name^='twitter:'],title").forEach((elemento) => {
      const chaveMeta = elemento.tagName === "TITLE" ? "title" : `${elemento.tagName}:${elemento.getAttribute("name") || elemento.getAttribute("property")}`;
      if (!originaisAtributos.has(chaveMeta)) originaisAtributos.set(chaveMeta, elemento.tagName === "TITLE" ? elemento.textContent : elemento.content);
      const valor = traduzirTexto(originaisAtributos.get(chaveMeta));
      if (elemento.tagName === "TITLE") elemento.textContent = valor;
      else elemento.content = valor;
    });
    const locale = document.querySelector("meta[property='og:locale']");
    if (locale) locale.content = idiomaAtual === "en" ? "en_US" : idiomaAtual === "es" ? "es_ES" : "pt_BR";
    document.querySelectorAll("script[type='application/ld+json']").forEach((script) => {
      if (!originaisAtributos.has(script)) originaisAtributos.set(script, script.textContent);
      if (idiomaAtual === "pt") { script.textContent = originaisAtributos.get(script); return; }
      try {
        const json = JSON.parse(originaisAtributos.get(script));
        const traduzirJson = (valor) => Array.isArray(valor) ? valor.map(traduzirJson) : valor && typeof valor === "object" ? Object.fromEntries(Object.entries(valor).map(([chaveJson, valorJson]) => [chaveJson, traduzirJson(valorJson)])) : typeof valor === "string" ? traduzirTexto(valor) : valor;
        script.textContent = JSON.stringify(traduzirJson(json), null, 2);
      } catch (_) {}
    });
    document.querySelectorAll("a[href*='wa.me']").forEach((link) => {
      if (!originaisAtributos.has(link)) originaisAtributos.set(link, link.href);
      const original = originaisAtributos.get(link);
      try {
        const url = new URL(original, window.location.href);
        const texto = url.searchParams.get("text");
        if (texto) { url.searchParams.set("text", traduzirTexto(texto)); link.href = url.toString(); }
      } catch (_) {}
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
