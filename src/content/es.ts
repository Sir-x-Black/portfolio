import { docs, facts } from './facts';
import type { SiteContent } from './types';

const { roles } = facts;

// "Ingeniero" es un título profesional regulado en Argentina. Como la carrera de
// Ingeniería quedó incompleta, la versión en español usa "desarrollador de
// software" y conserva el cargo oficial en inglés ("Software Engineer").
export const es: SiteContent = {
  locale: 'es',
  meta: {
    title: 'Gonzalo Palavesino | Desarrollador de software (Java, Spring Boot, Oracle SQL)',
    description:
      'Desarrollador Java (Spring Boot, Oracle SQL) con seis años en producción. Disponible para entrenamiento y evaluación de IA: código y tareas en español.',
    ogImageAlt: 'Gonzalo Palavesino, desarrollador de software. Una línea de código Java marcada en rojo por un revisor.',
    cvTitle: 'Currículum | Gonzalo Palavesino',
    cvDescription:
      'Currículum de Gonzalo Palavesino, desarrollador de software: Java, Spring Boot, Oracle SQL y PL/SQL, OpenShift.',
    notFoundTitle: 'Página no encontrada | Gonzalo Palavesino',
  },
  ui: {
    skipToContent: 'Ir al contenido',
    primaryNav: 'Secciones',
    nav: { aiFit: 'Entrenamiento de IA', experience: 'Experiencia', work: 'Trabajos', contact: 'Contacto' },
    cvLink: 'Currículum',
    otherLanguage: { label: 'Read in English', name: 'English' },
    yes: 'Sí',
    no: 'No',
    present: 'actualidad',
    months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  },
  hero: {
    name: facts.name.display,
    role: 'Desarrollador de software. Java, Spring Boot, Oracle SQL.',
    thesis: 'Encuentro lo que está mal en el código y lo explico por escrito.',
    intro:
      'En NTT DATA lidero el desarrollo técnico de una plataforma de gobierno digital: más de 10 microservicios Spring Boot, cambios de datos en producción sobre Oracle, la migración a Java 17 y Spring Boot 3, análisis de incidentes y revisiones de código. Busco trabajo de entrenamiento y evaluación de IA que pida esos mismos hábitos: leer una respuesta con atención, encontrar qué está mal y explicarlo para que se pueda corregir.',
    actions: { email: 'Enviar un email', cv: 'Ver el currículum', linkedin: 'LinkedIn', github: 'GitHub' },
    factsLabel: 'En resumen',
    facts: [
      'Software Engineer en NTT DATA desde noviembre de 2021.',
      'Mendoza, Argentina (UTC−3).',
      'Español: nativo. Inglés: intermedio-alto (B2), con lectura y escritura avanzadas.',
    ],
  },
  review: {
    title: 'Una respuesta de IA plausible, revisada',
    disclaimer:
      'Un ejemplo construido: lo escribí para mostrar cómo reviso código. No proviene de un cliente ni de un proyecto de entrenamiento de IA.',
    promptLabel: 'Consigna',
    prompt:
      'App en Spring Boot 3. Dejar abierto `/api/public/**`, exigir autenticación en todo lo demás y responder 401 en lugar de redirigir a una página de login.',
    viewLegend: 'Mostrar',
    views: { answer: 'Respuesta del modelo', reviewed: 'Después de la revisión' },
    codeLabel: 'Código de la respuesta del modelo y de su versión corregida',
    excerptNote: 'Fragmento: se omiten el package y los imports de Spring.',
    notesTitle: 'Notas de revisión',
    sourcePrefix: 'Fuente:',
    issues: [
      {
        id: 1,
        title: '`javax.servlet` no existe en Spring Boot 3',
        body: 'Spring Boot 3 pasó a Jakarta EE, así que las clases de servlet están en `jakarta.servlet`. Falla el import y, con él, cada uso de `HttpServletResponse`.',
        source: { label: 'Guía de migración a Spring Boot 3.0', href: docs.bootMigration },
      },
      {
        id: 2,
        title: 'Se eliminó `WebSecurityConfigurerAdapter`',
        body: 'Spring Security 6 quitó el adapter, y con él el override de `configure`. La seguridad ahora se declara como un bean `SecurityFilterChain`.',
        source: { label: 'Blog de Spring, configurar la seguridad sin el adapter', href: docs.noAdapter },
      },
      {
        id: 3,
        title: '`authorizeRequests()` y `exceptionHandling()` están marcados para eliminación',
        body: 'Las dos formas sin argumentos están deprecadas para su eliminación. Las reemplazan las versiones con lambdas, `authorizeHttpRequests(…)` y `exceptionHandling(…)`, que además vuelven innecesario el encadenamiento con `.and()`.',
        source: { label: 'Referencia de Spring Security, autorización de requests HTTP', href: docs.authorizeHttpRequests },
      },
      {
        id: 4,
        title: '`antMatchers` ya no existe',
        body: 'Se eliminó en Spring Security 6. Lo reemplaza `requestMatchers`, que acepta los mismos patrones de ruta.',
        source: { label: 'Referencia de Spring Security, autorización de requests HTTP', href: docs.authorizeHttpRequests },
      },
    ],
    rubricTitle: 'Rúbrica',
    rubric: [
      { label: 'Hace lo que pide la consigna', answer: { pass: true }, reviewed: { pass: true } },
      {
        label: 'Compila en Spring Boot 3',
        answer: { pass: false, detail: '6 errores, 3 causas raíz' },
        reviewed: { pass: true, detail: 'sin advertencias' },
      },
      {
        label: 'Usa las APIs actuales de Spring Security',
        answer: { pass: false, detail: '4 problemas' },
        reviewed: { pass: true },
      },
    ],
    verdictLabel: 'Veredicto',
    verdict: {
      answer: 'Intención correcta, API desactualizada. Está escrita al estilo de Spring Security 5 y no compila en Spring Boot 3.',
      reviewed:
        'El mismo comportamiento con la API actual: `/api/public/**` sigue abierto, el resto exige autenticación y las requests sin autenticar reciben un 401.',
    },
    verification:
      'Para confirmar el veredicto, las dos versiones se compilaron con `javac -Xlint:all` contra las bibliotecas de Spring Boot 3.5.16 (Spring Security 6.5.11).',
    evidenceLink: 'Correr la verificación.',
  },
  aiFit: {
    heading: 'Dónde se cruza mi trabajo con el entrenamiento de IA',
    intro:
      'Las plataformas de entrenamiento de IA describen el trabajo como calificar y rankear respuestas, escribir rúbricas de evaluación y escribir prompts que hagan fallar a los modelos. ==Todavía no trabajé en un proyecto de entrenamiento de IA.== Esta es la parte de mi trabajo en software que se transfiere, y de dónde viene.',
    columns: { task: 'Tarea', needs: 'Qué requiere', evidence: 'Experiencia más cercana' },
    rows: [
      {
        task: 'Calificar y rankear respuestas de código',
        needs: 'Ver cuándo un código convincente está mal, y decir qué respuesta es mejor y por qué.',
        evidence:
          'Revisiones de código como referente técnico del equipo. Liderar la migración a Java 17 y Spring Boot 3 me enseñó qué APIs cambiaron, un punto donde el código generado suele fallar.',
      },
      {
        task: 'Escribir rúbricas de evaluación',
        needs: 'Convertir “bueno” en criterios explícitos que dos revisores apliquen de la misma manera.',
        evidence:
          'Checkpoints y evaluaciones de seguridad para los despliegues a producción. Seguimiento de la ejecución de pruebas de 31 procesos de negocio.',
      },
      {
        task: 'Escribir prompts que hagan fallar al modelo',
        needs: 'Conocer un dominio lo suficiente como para preguntar en qué se va a equivocar una respuesta que suena segura.',
        evidence:
          'Seis años de Java y SQL en producción. Uso activamente herramientas de IA para programar y ayudé a incorporar Claude Code al flujo de trabajo del equipo.',
      },
      {
        task: 'Explicar errores y escribir correcciones',
        needs: 'Precisar la causa y documentarla para que otra persona pueda actuar.',
        evidence:
          'Incidentes de producción rastreados hasta el código, los datos o la configuración con Kibana y Dynatrace. Documentación técnica, de arquitectura y de seguridad para los despliegues a producción.',
      },
      {
        task: 'Revisar respuestas en español',
        needs: 'Criterio nativo sobre gramática, tono y usos regionales.',
        evidence: 'Hablante nativo de español (Argentina). En NTT DATA, y antes en la Municipalidad de Mendoza, trabajé en software en español para el sector público.',
      },
    ],
    notes: [
      {
        kind: 'claim',
        lead: 'Lo que no afirmo.',
        body: 'Experiencia en proyectos de entrenamiento de IA o en ingeniería de machine learning. Lo que aporto son seis años construyendo software en producción y, desde 2021, revisándolo, verificándolo y documentándolo en NTT DATA.',
        anchor: 'Todavía no trabajé en un proyecto de entrenamiento de IA.',
      },
      {
        kind: 'gloss',
        lead: 'Dominios de código.',
        body: 'Java (de 8 a 21), Spring Boot, SQL y PL/SQL sobre Oracle, TypeScript con Angular.',
      },
    ],
  },
  experience: {
    heading: 'Experiencia',
    timelineLabel: 'Línea de tiempo de los puestos desde diciembre de 2019, a escala',
    timelineNote: 'Puestos desde 2019, a escala.',
    roles: [
      {
        id: 'ntt',
        title: 'Software Engineer',
        org: facts.employer,
        short: 'NTT DATA',
        location: 'Argentina',
        ...roles.ntt,
        context:
          'Plataforma de expedientes digitales para el gobierno de una ciudad de Argentina, integrada con los sistemas de gestión documental y de expediente electrónico del gobierno.',
        bullets: [
          'Lidero el desarrollo técnico y el mantenimiento de más de 10 microservicios en Java 17 y Spring Boot 3 con frontend en Angular, desplegados en ==OpenShift== en DEV, HML, QA y PRD.',
          'Lideré la migración de Java 11 a 17 y de Spring Boot 2 a 3 (de `javax` a `jakarta`, Hibernate 6, Spring Security con `SecurityFilterChain`) y actualicé dependencias para cumplir los requisitos de seguridad del cliente.',
          'Planifiqué la migración incremental del frontend de Angular 14 a 19, incluyendo RxJS 7 y Angular Material.',
          'Desarrollo e integro servicios REST y SOAP con sistemas externos del gobierno, incluyendo el análisis de fallas de conectividad y propuestas de mecanismos de reintento.',
          'Diseño y ejecuto scripts ==idempotentes== en Oracle 19c (SQL y PL/SQL) para cargas y actualizaciones masivas en producción (MERGE, tablas temporales globales, verificación previa al DML). En un solo despliegue se procesaron más de 13.000 registros.',
          'Coordiné el saneamiento de datos del entorno de QA en 73 tablas del esquema y el seguimiento de la ejecución de pruebas de 31 procesos de negocio.',
          'Analizo incidentes de producción con logs y métricas en Kibana y Dynatrace, y rastreo la causa raíz hasta el código, los datos o la configuración.',
          'Escribo documentación técnica, de arquitectura y de seguridad para los despliegues a producción, incluidos checkpoints y evaluaciones de seguridad, y colecciones de Postman de más de 200 requests para QA.',
          'Administro repositorios y pipelines de CI/CD en GitLab, y hago el seguimiento del trabajo en Jira con metodologías ágiles.',
          'Soy el referente técnico del equipo: comparto conocimiento, reviso código e impulso la incorporación de herramientas de IA (Claude Code) al flujo de trabajo.',
        ],
        notes: [
          {
            kind: 'private',
            lead: 'No es público.',
            body: 'El código, los datos y los documentos del cliente son confidenciales. En una entrevista puedo explicar los enfoques, no mostrar los artefactos.',
          },
          {
            kind: 'gloss',
            lead: 'OpenShift.',
            body: 'La plataforma de Kubernetes de Red Hat. DEV, HML (homologación, el entorno de aceptación del cliente), QA y PRD son los cuatro entornos de la plataforma.',
            anchor: 'OpenShift',
          },
          {
            kind: 'gloss',
            lead: 'Idempotente.',
            body: 'Un script que deja el mismo resultado si corre una o dos veces, así un reintento no duplica ni corrompe datos.',
            anchor: 'idempotentes',
          },
        ],
      },
      {
        id: 'cumbresoft',
        title: 'Desarrollador Java',
        org: 'CumbreSoft',
        short: 'CumbreSoft',
        location: 'Mendoza, Argentina',
        ...roles.cumbresoft,
        bullets: [
          'Desarrollé aplicaciones web en Java con ZK Framework y consultas SQL sobre bases de datos relacionales.',
          'Automaticé trámites administrativos y flujos de procesos de negocio con Sayges y BonitaSoft (BPM).',
          'Brindé soporte técnico a usuarios y clientes.',
        ],
        notes: [],
      },
      {
        id: 'municipality',
        title: 'Pasante de desarrollo Java',
        org: 'Municipalidad de la Ciudad de Mendoza',
        short: 'Municipalidad de Mendoza',
        location: 'Mendoza, Argentina',
        ...roles.municipality,
        bullets: ['Participé en la digitalización de procesos municipales con Sayges.', 'Desarrollé funcionalidades en Java con ZK Framework.'],
        notes: [],
      },
    ],
    thread: {
      kind: 'gloss',
      lead: 'Un hilo común.',
      body: 'Todos mis puestos consistieron en desarrollar software para trámites administrativos: procesos municipales, flujos de negocio y los expedientes del gobierno de una ciudad.',
    },
  },
  work: {
    heading: 'Trabajos seleccionados',
    intro: 'Dos trabajos profesionales, descritos sin detalles del cliente, y un proyecto personal.',
    cases: [
      {
        id: 'migration',
        title: 'Llevar una plataforma a Java 17 y Spring Boot 3',
        kind: 'Trabajo profesional en NTT DATA',
        sections: [
          {
            label: 'Contexto',
            body: 'Una plataforma de expedientes digitales para el gobierno de una ciudad: más de 10 microservicios Spring Boot y un frontend en Angular sobre OpenShift, integrados por REST y SOAP con los sistemas documentales y de expedientes del gobierno.',
          },
          {
            label: 'Problema',
            body: 'Los servicios corrían en Java 11 y Spring Boot 2, y los requisitos de seguridad del cliente exigían dependencias actualizadas.',
          },
          {
            label: 'Mi parte',
            body: 'Lideré la migración: de Java 11 a 17, de Spring Boot 2 a 3, el cambio de espacio de nombres ==de `javax` a `jakarta`==, Hibernate 6 y la configuración de Spring Security reescrita con `SecurityFilterChain`. También planifiqué el camino incremental del frontend de Angular 14 a 19.',
          },
          {
            label: 'Decisiones',
            body: 'El plan para el frontend es incremental y no de un salto: Angular se actualiza una versión mayor por vez, que es como funciona su propia herramienta de actualización.',
          },
          {
            label: 'Resultado',
            body: 'Los servicios corren en Java 17 y Spring Boot 3 con las dependencias actualizadas. El ejemplo del inicio de esta página muestra el tipo de incompatibilidades que resuelve esta migración.',
          },
        ],
        links: [],
        notes: [
          {
            kind: 'gloss',
            lead: 'En resumen.',
            body: 'Jakarta EE renombró los paquetes `javax.*` de Java EE a `jakarta.*`, así que cada import de clases de servlets, persistencia o validación tuvo que cambiar.',
            anchor: 'de `javax` a `jakarta`',
          },
          { kind: 'private', lead: 'No es público.', body: 'No puedo mostrar código ni documentos del cliente.' },
        ],
      },
      {
        id: 'oracle',
        title: 'Cambios de datos en producción que se pueden correr dos veces sin riesgo',
        kind: 'Trabajo profesional en NTT DATA',
        sections: [
          {
            label: 'Contexto',
            body: 'Algunos despliegues a producción necesitaban cargas y actualizaciones masivas de datos en Oracle 19c.',
          },
          { label: 'Mi parte', body: 'Diseño y ejecuto esos scripts, en SQL y PL/SQL.' },
          {
            label: 'Decisiones',
            body:
              'Idempotentes por construcción: [`MERGE`](' +
              docs.oracleMerge +
              ') en lugar de inserts y updates a ciegas, ==tablas temporales globales== para preparar los datos y consultas de verificación antes de cualquier DML. El objetivo es un script que se pueda volver a correr después de una interrupción sin duplicar ni corromper filas.',
          },
          {
            label: 'Resultado',
            body: 'Más de 13.000 registros procesados en un solo despliegue.',
          },
        ],
        links: [],
        notes: [
          {
            kind: 'gloss',
            lead: 'Tabla temporal global.',
            body:
              'Una tabla de Oracle cuyas filas solo ve la sesión que las insertó, y que desaparecen al hacer commit o al cerrar la sesión, según cómo se defina. [Documentación de Oracle](' +
              docs.oracleTemporaryTables +
              ').',
            anchor: 'tablas temporales globales',
          },
          { kind: 'private', lead: 'No es público.', body: 'Los scripts y los datos pertenecen al cliente.' },
        ],
      },
      {
        id: 'duck',
        title: 'Project Duck: publicar un juego para Android',
        kind: 'Proyecto personal, 2026',
        sections: [
          {
            label: 'Contexto',
            body: 'Un proyecto personal: un juego idle clicker hecho con Godot Engine y publicado en Google Play bajo el sello BlackCorp.',
          },
          {
            label: 'Qué se publicó',
            body: 'Inicio de sesión con Google o email, progreso que acompaña al jugador a un teléfono nuevo, un ranking online, incursiones en los patios de otros jugadores, anuncios y compras dentro de la app.',
          },
          {
            label: 'Más allá del código',
            body: 'Publicar en una tienda es cumplir una larga lista de reglas ajenas: política de privacidad, términos del servicio, una página para borrar la cuenta, una clasificación de contenido, un archivo `app-ads.txt` para AdMob y créditos de licencias para Godot y sus componentes de terceros. Todo eso está publicado.',
          },
          {
            label: 'Por qué está acá',
            body: 'El trabajo de anotación y evaluación se basa en guías detalladas. Publicar una app respetando las políticas de una tienda obliga a seguirlas al pie de la letra.',
          },
        ],
        links: [
          { label: 'Ficha en Google Play', href: facts.links.projectDuckStore },
          { label: 'Sitio de Project Duck y sus políticas', href: facts.links.projectDuckSite },
        ],
        notes: [
          { kind: 'public', lead: 'Es público.', body: 'La ficha de la tienda, y el sitio del juego con sus páginas de políticas y los créditos del motor, los plugins, las tipografías y los sonidos hechos por terceros.' },
          { kind: 'private', lead: 'No es público.', body: 'El código fuente del juego.' },
        ],
      },
    ],
  },
  skills: {
    heading: 'Herramientas y tecnologías',
    intro: 'Agrupadas según dónde las usé, para que quede claro cuáles tienen peso en producción.',
    groups: [
      {
        label: 'En mi puesto actual en NTT DATA',
        items: [
          'Java 17',
          'Spring Boot 3',
          'Spring Security',
          'Hibernate 6 y JPA',
          'REST',
          'SOAP',
          'Oracle Database 19c',
          'SQL',
          'PL/SQL',
          'Angular',
          'TypeScript',
          'RxJS',
          'Angular Material',
          'OpenShift',
          'Kubernetes',
          'GitLab CI/CD',
          'Kibana',
          'Dynatrace',
          'Postman',
          'Jira',
          'Claude Code',
        ],
      },
      {
        label: 'Otras herramientas que manejo',
        items: [
          'Java 8, 11 y 21',
          'Spring Cloud Config',
          'Maven',
          'JUnit',
          'Lombok',
          'DBeaver',
          'Docker',
          'Tomcat',
          'Git',
          'Linux',
          'JavaScript',
          'Python',
          'HTML',
          'CSS',
          'Bootstrap',
          'TDD',
          'Scrum',
        ],
      },
      { label: 'Puestos anteriores', items: ['ZK Framework', 'BonitaSoft (BPM)', 'Sayges'] },
      { label: 'Proyectos personales', items: ['Godot Engine'] },
    ],
  },
  education: {
    heading: 'Formación e idiomas',
    items: [
      {
        title: 'Licenciatura en Informática y Desarrollo de Software',
        school: 'Universidad del Aconcagua',
        status: 'Incompleta',
      },
      { title: 'Ingeniería en Informática', school: 'Universidad de Mendoza', status: 'Tres años cursados' },
      { title: 'Técnico en Reparación y Mantenimiento de PC y Redes', school: 'Instituto Escuelas Newton' },
      { title: 'Bachiller en Humanidades y Ciencias Sociales', school: 'Escuela Secundaria Maestro Alfredo Bravo' },
    ],
    languagesHeading: 'Idiomas',
    languages: [
      { name: 'Español', level: 'Nativo' },
      { name: 'Inglés', level: 'Intermedio-alto (B2): lectura y escritura avanzadas, conversación intermedia' },
    ],
  },
  contact: {
    heading: 'Contacto',
    intro: 'El email es la mejor forma de contactarme, en español o en inglés.',
    copy: 'Copiar dirección',
    copied: 'Copiada',
    copyFailed: 'No se pudo copiar. La dirección se puede seleccionar a mano.',
    linkedin: 'Perfil de LinkedIn',
    github: 'Perfil de GitHub',
    location: 'Mendoza, Argentina. UTC−3.',
    availability: 'Disponible para proyectos remotos de entrenamiento y evaluación de IA, y para puestos de desarrollo de software.',
  },
  footer: {
    colophon:
      'Hecho con React, TypeScript y Vite. Tipografías: Newsreader, Public Sans y JetBrains Mono.',
    source: 'Código fuente en GitHub',
    rights: `© ${__BUILD_MONTH__.slice(0, 4)} ${facts.name.display}`,
  },
  cv: {
    heading: 'Currículum',
    print: 'Imprimir o guardar como PDF',
    back: 'Volver al portfolio',
    summaryHeading: 'Perfil',
    summary:
      'Desarrollador de software con seis años de experiencia profesional en Java, y microservicios Spring Boot desde 2021. Trabaja en software de gobierno digital a gran escala: Oracle SQL y PL/SQL, OpenShift y Kubernetes, integraciones REST y SOAP. Lideró la migración a Java 17 y Spring Boot 3 y planificó la actualización de Angular 14 a 19; analiza incidentes de producción con Kibana y Dynatrace; escribe documentación técnica y de seguridad para los despliegues a producción. Referente técnico del equipo y usuario activo de herramientas de IA en el desarrollo.',
    experienceHeading: 'Experiencia',
    skillsHeading: 'Conocimientos técnicos',
    educationHeading: 'Formación',
    languagesHeading: 'Idiomas',
    projectsHeading: 'Proyecto personal',
    project:
      '**Project Duck**, un juego para Android hecho con Godot Engine y publicado en Google Play (2026): cuentas, progreso sincronizado en la nube, ranking online, anuncios y compras dentro de la app, con sus páginas de privacidad, términos y borrado de cuenta.',
  },
  notFound: {
    heading: 'Esta página no existe.',
    body: 'Puede que la dirección tenga un error o que la página se haya movido.',
    home: 'Ir al portfolio',
  },
};
