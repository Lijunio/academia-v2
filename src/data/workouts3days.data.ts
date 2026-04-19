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
    name: "Crucifixo cabo ou máquina",
    sets: "3x 12–15",
    description: "Alongamento e definição do peitoral - amplitude máxima",
    muscleGroup: "peito",
    images: ["/images/workouts/treino-a/crossover.webp", "/images/workouts/treino-a/voador.webp"]
  },
  // Ombro
  {
    id: 4,
    name: "Desenvolvimento halteres",
    sets: "3x 8–10",
    description: "Ombro anterior - desenvolvimento frontal dos deltóides",
    muscleGroup: "ombro",
    images: ["/images/workouts/treino-a/desenvolvimento.webp"]
  },
  {
    id: 5,
    name: "Elevação lateral",
    sets: "4x 12–15",
    description: "Ombro lateral - alargamento dos deltóides",
    muscleGroup: "ombro",
    images: ["/images/workouts/treino-a/elevacaolateral.jpg", "/images/workouts/treino-a/elevacaolateralinclinado.png"]
  },
  // Tríceps
  {
    id: 6,
    name: "Tríceps testa",
    sets: "3x 8–10",
    description: "Cabeça longa do tríceps - extensão completa",
    muscleGroup: "triceps",
    images: ["/images/workouts/treino-a/tricepstesta1.webp", "/images/workouts/treino-a/tricepstesta2.gif", "/images/workouts/treino-a/tricepstesta3.webp"]
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
    images: ["/images/workouts/treino-a/tricepsmergulho.png", "/images/workouts/treino-a/paralelas.webp"]
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
    images: ["/images/workouts/treino-b/barrafixa.gif", "/images/workouts/treino-b/puxadafrente.gif"]
  },
  {
    id: 2,
    name: "Remada baixa",
    sets: "3x 10–12",
    description: "Costas médias - foco na parte central",
    muscleGroup: "costas",
    images: ["/images/workouts/treino-b/remadabaixa.gif"]
  },
  {
    id: 3,
    name: "Remada curvada barra",
    sets: "3x 8–10",
    description: "Espessura das costas - desenvolvimento da espessura",
    muscleGroup: "costas",
    images: ["/images/workouts/treino-b/remadacurvada.webp"]
  },
  // Trapézio
  {
    id: 4,
    name: "Elevação posterior",
    sets: "3x 12–15",
    description: "Ombro posterior - desenvolvimento dos deltóides posteriores",
    muscleGroup: "trapezio",
    images: ["/images/workouts/treino-b/elevacaoposterior.gif", "/images/workouts/treino-b/maquinaposterior.gif"]
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
    images: ["/images/workouts/treino-b/roscapunho1.gif", "/images/workouts/treino-b/roscapunho2.gif"]
  },
  {
    id: 9,
    name: "Rosca punho reversa",
    sets: "3x 15–20",
    description: "Extensores do antebraço - equilíbrio muscular",
    muscleGroup: "antebraco",
    images: ["/images/workouts/treino-b/roscapunho-reversa1.gif", "/images/workouts/treino-b/roscapunho-reversa2.gif"]
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

// ========== TREINO 3: PERNAS (POSTERIOR + ANTERIOR + PANTURRILHA) ==========
const treino3Exercises: ExerciseBase[] = [
  // Posterior primeiro (como solicitado)
  {
    id: 1,
    name: "Levantamento terra romeno",
    sets: "4x 6–8",
    description: "Posterior + Glúteo - desenvolvimento da cadeia posterior",
    muscleGroup: "posterior",
    images: ["/images/workouts/treino-b/levantamentoterra.gif", "/images/workouts/treino-b/stiff.gif"]
  },
  {
    id: 2,
    name: "Mesa flexora",
    sets: "3x 10–12",
    description: "Posterior da coxa - isolamento do posterior",
    muscleGroup: "posterior",
    images: ["/images/workouts/treino-b/mesaflexora.webp"]
  },
  {
    id: 3,
    name: "Cadeira flexora",
    sets: "3x 10",
    description: "Posterior da coxa - variação sentado",
    muscleGroup: "posterior",
    images: ["/images/workouts/treino-b/cadeiraflexora.gif"]
  },
  // Perna Anterior
  {
    id: 4,
    name: "Agachamento livre ou hack",
    sets: "4x 6–8",
    description: "Quadríceps + Glúteo - exercício rei para pernas",
    muscleGroup: "pernas",
    images: ["/images/workouts/treino-a/agachamentolivre.avif", "/images/workouts/treino-a/agachamentohack.webp"]
  },
  {
    id: 5,
    name: "Leg Press 45°",
    sets: "3x 10–12",
    description: "Quadríceps - carga controlada",
    muscleGroup: "pernas",
    images: ["/images/workouts/treino-a/legpress.webp"]
  },
  {
    id: 6,
    name: "Cadeira extensora",
    sets: "3x 12–15",
    description: "Quadríceps - isolamento perfeito",
    muscleGroup: "pernas",
    images: ["/images/workouts/treino-a/cadeiraextensora.webp"]
  },
  {
    id: 7,
    name: "Cadeira adutora",
    sets: "3x 12–15",
    description: "Adutores da coxa - parte interna das coxas",
    muscleGroup: "pernas",
    images: ["/images/workouts/treino-a/cadeiraadutora.webp"]
  },
  {
    id: 8,
    name: "Cadeira abdutora",
    sets: "3x 12–15",
    description: "Abdutores da coxa - parte externa das coxas",
    muscleGroup: "pernas",
    images: ["/images/workouts/treino-a/cadeiraabdutora.gif"]
  },
  // Panturrilha
  {
    id: 9,
    name: "Panturrilha em pé",
    sets: "4x 10–15",
    description: "Panturrilha (gastrocnêmio) - desenvolvimento das panturrilhas",
    muscleGroup: "panturrilha",
    images: ["/images/workouts/treino-b/panturrilha-pe.gif"]
  },
  {
    id: 10,
    name: "Panturrilha sentada",
    sets: "3x 15–20",
    description: "Panturrilha (sóleo) - parte inferior das panturrilhas",
    muscleGroup: "panturrilha",
    images: ["/images/workouts/treino-b/panturrilha-sentada.gif"]
  },
  // Abdominal (sem peso)
  {
    id: 11,
    name: "Abdominal",
    sets: "3x 15",
    description: "Fortalecimento do core - não requer registro de peso",
    muscleGroup: "abdominal",
    images: ["/images/workouts/abdominal.webp"],
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
    focus: 'Pernas (Posterior + Anterior + Panturrilha) + Abdominal',
    groups: ['posterior', 'pernas', 'panturrilha', 'abdominal'],
    exercises: treino3Exercises,
    totalExercises: treino3Exercises.length,
    totalSets: 35,
    duration: 75,
    backgroundImage: "/images/workouts/treino-a/background.webp"
  }
};