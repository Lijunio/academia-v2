// src/data/workouts3days.data.ts
import { ExerciseBase } from '../types/workout.types';

// ========== TREINO 1: PEITO + OMBRO + TRÍCEPS ==========
const treino1Exercises: ExerciseBase[] = [
  // Peito
  {
    id: 1,
    name: "Supino reto (halteres)",
    sets: "4x 6–8",
    description: "Peitoral médio - foco no desenvolvimento do peitoral completo",
    muscleGroup: "peito",
    images: ["/images/workouts/treino-a/supinoreto.webp"]
  },
  {
    id: 2,
    name: "Supino inclinado (halteres)",
    sets: "3x 8–10",
    description: "Peitoral superior - ênfase na parte superior do peitoral",
    muscleGroup: "peito",
    images: ["/images/workouts/treino-a/supinoinclinado.jpg"]
  },
  {
    id: 3,
    name: "Crucifixo cabo ou máquina ou banco",
    sets: "3x 12–15",
    description: "Alongamento e definição do peitoral - amplitude máxima",
    muscleGroup: "peito",
    images: ["/images/workouts/treino-a/crossover.webp", "/images/workouts/treino-a/voador.webp", "/images/workouts/treino-a/crucifixoReto.gif"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Crossover (cabo)", description: "Maior amplitude e alongamento do peitoral" },
      { id: 2, name: "Voador (máquina)", description: "Maior estabilidade e isolamento" },
      { id: 3, name: "Crucifixo reto", description: "Versão com halteres em banco reto" }
    ]
  },
  // Ombro
  {
    id: 4,
    name: "Desenvolvimento halteres",
    sets: "3x 8–10",
    description: "Ombro anterior - desenvolvimento frontal dos deltóides",
    muscleGroup: "ombro",
    images: ["/images/workouts/treino-a/desenvolvimento.webp", "/images/workouts/treino-a/desenvolvimentoBarra.jpg", "/images/workouts/treino-a/desenvolvimentoMaquina.jpg"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Desenvolvimento com halteres", description: "Maior amplitude e estabilização" },
      { id: 2, name: "Desenvolvimento com barra", description: "Maior carga e estabilidade" },
      { id: 3, name: "Desenvolvimento máquina", description: "Maior isolamento e segurança" }
    ]
  },
  {
    id: 5,
    name: "Elevação lateral",
    sets: "4x 12–15",
    description: "Ombro lateral - alargamento dos deltóides",
    muscleGroup: "ombro",
    images: ["/images/workouts/treino-a/elevacaolateral.jpg", "/images/workouts/treino-a/elevacaolateralinclinado.png"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Elevação lateral em pé", description: "Padrão - maior recrutamento de deltoide lateral" },
      { id: 2, name: "Elevação lateral inclinado", description: "Maior ênfase no deltoide lateral e posterior" }
    ]
  },
  // Tríceps
  {
    id: 6,
    name: "Tríceps testa",
    sets: "3x 8–10",
    description: "Cabeça longa do tríceps - extensão completa",
    muscleGroup: "triceps",
    images: ["/images/workouts/treino-a/tricepstesta1.webp", "/images/workouts/treino-a/tricepstesta2.gif", "/images/workouts/treino-a/tricepstesta3.webp"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Tríceps testa com barra W", description: "Padrão - posição neutra para os punhos" },
      { id: 2, name: "Tríceps testa com halteres", description: "Correção de assimetria - unilateral" },
      { id: 3, name: "Tríceps testa máquina", description: "Maior isolamento e estabilidade" }
    ]
  },
  {
    id: 7,
    name: "Tríceps corda",
    sets: "3x 10–12",
    description: "Cabeça lateral do tríceps - pico de contração",
    muscleGroup: "triceps",
    images: ["/images/workouts/treino-a/tricepscorda.gif"]
  },
  {
    id: 8,
    name: "Mergulho banco/paralela",
    sets: "3x 8–10",
    description: "Cabeça medial + força geral - exercício composto",
    muscleGroup: "triceps",
    images: ["/images/workouts/treino-a/tricepsmergulho.png", "/images/workouts/treino-a/paralelas.webp"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Mergulho no banco (francês)", description: "Iniciante - com apoio no banco" },
      { id: 2, name: "Mergulho nas paralelas", description: "Avançado - usa peso corporal ou adicional" }
    ]
  },
  // Abdominal (sem peso)
  {
    id: 9,
    name: "Abdominal",
    sets: "3x 15",
    description: "Fortalecimento do core - não requer registro de peso",
    muscleGroup: "abdominal",
    images: ["/images/workouts/abdominal.jpg"],
    hasVariations: false,
    noWeight: true
  },
  // Caminhada (com dados de esteira)
  {
    id: 10,
    name: "Caminhada",
    sets: "1x",
    description: "Atividade aeróbica - registrar distância e tempo",
    muscleGroup: "cardio",
    images: ["/images/workouts/caminhada.webp"],
    isCardio: true
  }
];

// ========== TREINO 2: COSTAS + TRAPÉZIO + BÍCEPS + ANTEBRAÇO ==========
const treino2Exercises: ExerciseBase[] = [
  // Costas
  {
    id: 1,
    name: "Barra fixa ou puxada frente",
    sets: "4x 6–8",
    description: "Grande dorsal (largura) - desenvolvimento das costas",
    muscleGroup: "costas",
    images: ["/images/workouts/treino-b/barrafixa.gif", "/images/workouts/treino-b/puxadafrente.gif"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Barra fixa", description: "Maior recrutamento de core e estabilizadores" },
      { id: 2, name: "Puxada frente na polia", description: "Maior isolamento do latíssimo do dorso" }
    ]
  },
  {
    id: 2,
    name: "Remada baixa",
    sets: "3x 10–12",
    description: "Costas médias - foco na parte central",
    muscleGroup: "costas",
    images: ["/images/workouts/treino-b/remadabaixa.gif", "/images/workouts/treino-b/remadaBaixaMaquina.webp"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Remada baixa com barra", description: "Padrão - maior amplitude" },
      { id: 2, name: "Remada baixa máquina", description: "Maior estabilidade e isolamento" }
    ]
  },
  {
    id: 3,
    name: "Remada curvada barra",
    sets: "3x 8–10",
    description: "Espessura das costas - desenvolvimento da espessura",
    muscleGroup: "costas",
    images: ["/images/workouts/treino-b/remadacurvada.webp", "/images/workouts/treino-b/remadaUnilateral.webp"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Remada curvada com barra", description: "Bilateral - mais carga" },
      { id: 2, name: "Remada curvada unilateral", description: "Correção de assimetria" }
    ]
  },
  // Trapézio
  {
    id: 4,
    name: "Elevação posterior",
    sets: "3x 12–15",
    description: "Ombro posterior - desenvolvimento dos deltóides posteriores",
    muscleGroup: "trapezio",
    images: ["/images/workouts/treino-b/elevacaoposterior.gif", "/images/workouts/treino-b/maquinaposterior.gif"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Elevação posterior com halteres", description: "Maior amplitude de movimento" },
      { id: 2, name: "Elevação posterior máquina", description: "Maior estabilidade e isolamento" }
    ]
  },
  {
    id: 5,
    name: "Encolhimento barra",
    sets: "4x 10–12",
    description: "Trapézio superior - desenvolvimento dos trapézios",
    muscleGroup: "trapezio",
    images: ["/images/workouts/treino-b/encolhimento.gif"]
  },
  // Bíceps
  {
    id: 6,
    name: "Rosca direta",
    sets: "3x 8–10",
    description: "Cabeça curta e longa do bíceps - desenvolvimento completo",
    muscleGroup: "biceps",
    images: ["/images/workouts/treino-b/roscadireta.gif"]
  },
  {
    id: 7,
    name: "Rosca alternada inclinada",
    sets: "3x 10–12",
    description: "Ênfase cabeça longa do bíceps - pico do bíceps",
    muscleGroup: "biceps",
    images: ["/images/workouts/treino-b/roscainclinada.gif"]
  },
  // Antebraço
  {
    id: 8,
    name: "Rosca punho",
    sets: "3x 15–20",
    description: "Flexores do antebraço - desenvolvimento dos antebraços",
    muscleGroup: "antebraco",
    images: ["/images/workouts/treino-b/roscapunho1.gif", "/images/workouts/treino-b/roscapunho2.gif"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Rosca punho com barra", description: "Bilateral - mais carga" },
      { id: 2, name: "Rosca punho com halteres", description: "Unilateral - correção de assimetria" }
    ]
  },
  {
    id: 9,
    name: "Rosca punho reversa",
    sets: "3x 15–20",
    description: "Extensores do antebraço - equilíbrio muscular",
    muscleGroup: "antebraco",
    images: ["/images/workouts/treino-b/roscapunho-reversa1.gif", "/images/workouts/treino-b/roscapunho-reversa2.gif"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Rosca punho reversa com barra", description: "Bilateral - mais carga" },
      { id: 2, name: "Rosca punho reversa com halteres", description: "Unilateral - correção de assimetria" }
    ]
  },
  // Abdominal (sem peso)
  {
    id: 10,
    name: "Abdominal",
    sets: "3x 15",
    description: "Fortalecimento do core - não requer registro de peso",
    muscleGroup: "abdominal",
    images: ["/images/workouts/abdominal.jpg"],
    hasVariations: false,
    noWeight: true
  },
  // Caminhada (com dados de esteira)
  {
    id: 11,
    name: "Caminhada",
    sets: "1x",
    description: "Atividade aeróbica - registrar distância e tempo",
    muscleGroup: "cardio",
    images: ["/images/workouts/caminhada.webp"],
    isCardio: true
  }
];

// ========== TREINO 3: PERNAS ==========
const treino3Exercises: ExerciseBase[] = [
  // ===== GRUPO PERNA POSTERIOR =====
  {
    id: 1,
    name: "Agachamento livre ou hack",
    sets: "4x 6–8",
    description: "Quadríceps + Glúteo - exercício rei para pernas",
    muscleGroup: "posterior",
    images: ["/images/workouts/treino-a/agachamentolivre.avif", "/images/workouts/treino-a/agachamentohack.webp"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Agachamento livre", description: "Maior recrutamento muscular e estabilização" },
      { id: 2, name: "Hack machine", description: "Maior estabilidade e foco em quadríceps" }
    ]
  },
  {
    id: 2,
    name: "Leg Press 45°",
    sets: "3x 10–12",
    description: "Quadríceps - carga controlada",
    muscleGroup: "posterior",
    images: ["/images/workouts/treino-a/legpress.webp"]
  },
  {
    id: 3,
    name: "Cadeira extensora",
    sets: "3x 12–15",
    description: "Quadríceps - isolamento perfeito",
    muscleGroup: "posterior",
    images: ["/images/workouts/treino-a/cadeiraextensora.webp"]
  },
  // ===== GRUPO PERNA ANTERIOR =====
  {
    id: 4,
    name: "Levantamento terra romeno",
    sets: "4x 6–8",
    description: "Posterior + Glúteo - desenvolvimento da cadeia posterior",
    muscleGroup: "pernas",
    images: ["/images/workouts/treino-b/levantamentoterra.gif", "/images/workouts/treino-b/stiff.gif"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Levantamento terra romeno", description: "Maior amplitude e recrutamento" },
      { id: 2, name: "Stiff", description: "Maior tensão nos isquiotibiais" }
    ]
  },
  {
    id: 5,
    name: "Mesa flexora",
    sets: "3x 10–12",
    description: "Posterior da coxa - isolamento do posterior",
    muscleGroup: "pernas",
    images: ["/images/workouts/treino-b/mesaflexora.webp"]
  },
  {
    id: 6,
    name: "Cadeira flexora",
    sets: "3x 10",
    description: "Posterior da coxa - variação sentado",
    muscleGroup: "pernas",
    images: ["/images/workouts/treino-b/cadeiraflexora.gif"]
  },
  // ===== GRUPO COMPLEMENTO =====
  {
    id: 7,
    name: "Cadeira adutora",
    sets: "3x 12–15",
    description: "Adutores da coxa - parte interna das coxas",
    muscleGroup: "complemento",
    images: ["/images/workouts/treino-a/cadeiraadutora.webp"]
  },
  {
    id: 8,
    name: "Cadeira abdutora",
    sets: "3x 12–15",
    description: "Abdutores da coxa - parte externa das coxas",
    muscleGroup: "complemento",
    images: ["/images/workouts/treino-a/cadeiraabdutora.gif"]
  },
  {
    id: 9,
    name: "Panturrilha (em pé ou sentado)",
    sets: "4x 10–15",
    description: "Escolha entre panturrilha em pé ou sentada",
    muscleGroup: "complemento",
    images: ["/images/workouts/treino-b/panturrilha-pe.gif", "/images/workouts/treino-b/panturrilha-sentada.gif"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Panturrilha em pé", description: "Maior ativação do gastrocnêmio" },
      { id: 2, name: "Panturrilha sentada", description: "Maior isolamento do sóleo" }
    ]
  },
  {
    id: 10,
    name: "Elevação pélvica (máquina ou chão)",
    sets: "3x 12–15",
    description: "Glúteos e core - escolha a variação",
    muscleGroup: "complemento",
    images: ["/images/workouts/treino-b/pelvica.gif"],
    hasVariations: true,
    variations: [
      { id: 1, name: "Elevação pélvica máquina", description: "Com carga controlada" },
      { id: 2, name: "Elevação pélvica no chão", description: "Com peso corporal" }
    ]
  },
  // ===== GRUPO ABDOMINAL =====
  {
    id: 11,
    name: "Abdominal",
    sets: "3x 15",
    description: "Fortalecimento do core - não requer registro de peso",
    muscleGroup: "abdominal",
    images: ["/images/workouts/abdominal.jpg"],
    hasVariations: false,
    noWeight: true
  }
];

export const workouts3DaysData = {
  workout1: {
    id: '1',
    name: 'Treino 1',
    focus: 'Peito + Ombro + Tríceps + Abdominal + Caminhada',
    groups: ['peito', 'ombro', 'triceps', 'abdominal', 'cardio'],
    exercises: treino1Exercises,
    totalExercises: treino1Exercises.length,
    totalSets: 27,
    duration: 75,
    backgroundImage: "/images/workouts/treino-a/background.webp"
  },
  workout2: {
    id: '2',
    name: 'Treino 2',
    focus: 'Costas + Trapézio + Bíceps + Antebraço + Abdominal + Caminhada',
    groups: ['costas', 'trapezio', 'biceps', 'antebraco', 'abdominal', 'cardio'],
    exercises: treino2Exercises,
    totalExercises: treino2Exercises.length,
    totalSets: 29,
    duration: 75,
    backgroundImage: "/images/workouts/treino-b/background.jpg"
  },
  workout3: {
    id: '3',
    name: 'Treino 3',
    focus: 'Pernas (Posterior + Anterior + Complemento + Abdominal)',
    groups: ['posterior', 'pernas', 'complemento', 'abdominal'],
    exercises: treino3Exercises,
    totalExercises: treino3Exercises.length,
    totalSets: 36,
    duration: 75,
    backgroundImage: "/images/workouts/treino-a/background.webp"
  }
};