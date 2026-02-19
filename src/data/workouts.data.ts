// src/data/workouts.data.ts
import { Workout } from '../types/workout.types';

const createBasicExercise = (
  id: number,
  name: string,
  sets: string,
  description: string,
  muscleGroup: 'peito' | 'ombro' | 'triceps' | 'pernas' | 'costas' | 'biceps' | 'trapezio' | 'antebraco' | 'posterior' | 'panturrilha',
  images: string[]
) => ({
  id,
  name,
  sets,
  description,
  muscleGroup,
  images
});

export const workoutsData: Workout[] = [
  {
    id: 'A',
    name: 'Treino A',
    focus: 'Peito + Ombro + Tríceps + Perna Anterior',
    groups: ['peito', 'ombro', 'triceps', 'pernas'],
    exercises: [

      createBasicExercise(
        1,
        "Supino reto (halteres)",
        "4x 6–8",
        "Peitoral médio - foco no desenvolvimento do peitoral completo",
        "peito",
        ["/images/workouts/treino-a/supinoreto.webp"]
      ),
      createBasicExercise(
        2,
        "Supino inclinado (halteres)",
        "3x 8–10",
        "Peitoral superior - ênfase na parte superior do peitoral",
        "peito",
        ["/images/workouts/treino-a/supinoinclinado.jpg"]
      ),
      createBasicExercise(
        3,
        "Crucifixo cabo ou máquina",
        "3x 12–15",
        "Alongamento e definição do peitoral - amplitude máxima",
        "peito",
        [
          "/images/workouts/treino-a/crossover.webp",
          "/images/workouts/treino-a/voador.webp"
        ]
      ),
      
      createBasicExercise(
        4,
        "Desenvolvimento halteres",
        "3x 8–10",
        "Ombro anterior - desenvolvimento frontal dos deltóides",
        "ombro",
        ["/images/workouts/treino-a/desenvolvimento.webp"]
      ),
      createBasicExercise(
        5,
        "Elevação lateral",
        "4x 12–15",
        "Ombro lateral - alargamento dos deltóides",
        "ombro",
        [
          "/images/workouts/treino-a/elevacaolateral.jpg",
          "/images/workouts/treino-a/elevacaolateralinclinado.png"
        ]
      ),
      
      createBasicExercise(
        6,
        "Tríceps testa",
        "3x 8–10",
        "Cabeça longa do tríceps - extensão completa",
        "triceps",
        [
          "/images/workouts/treino-a/tricepstesta1.webp",
          "/images/workouts/treino-a/tricepstesta2.gif",
          "/images/workouts/treino-a/tricepstesta3.webp"
        ]
      ),
      createBasicExercise(
        7,
        "Tríceps corda",
        "3x 10–12",
        "Cabeça lateral do tríceps - pico de contração",
        "triceps",
        ["/images/workouts/treino-a/tricepscorda.gif"]
      ),
      createBasicExercise(
        8,
        "Mergulho banco/paralela",
        "3x 8–10",
        "Cabeça medial + força geral - exercício composto",
        "triceps",
        [
          "/images/workouts/treino-a/tricepsmergulho.png",
          "/images/workouts/treino-a/paralelas.webp"
        ]
      ),
      
      createBasicExercise(
        9,
        "Agachamento livre ou hack",
        "4x 6–8",
        "Quadríceps + Glúteo - exercício rei para pernas",
        "pernas",
        [
          "/images/workouts/treino-a/agachamentolivre.avif",
          "/images/workouts/treino-a/agachamentohack.webp"
        ]
      ),
      createBasicExercise(
        10,
        "Leg Press 45°",
        "3x 10–12",
        "Quadríceps - carga controlada",
        "pernas",
        ["/images/workouts/treino-a/legpress.webp"]
      ),
      createBasicExercise(
        11,
        "Cadeira extensora",
        "3x 12–15",
        "Quadríceps - isolamento perfeito",
        "pernas",
        ["/images/workouts/treino-a/cadeiraextensora.webp"]
      ),
      createBasicExercise(
        12,
        "Cadeira adutora",
        "3x 12–15",
        "Adutores da coxa - parte interna das coxas",
        "pernas",
        ["/images/workouts/treino-a/cadeiraadutora.webp"]
      ),
      createBasicExercise(
        13,
        "Cadeira abdutora",
        "3x 12–15",
        "Abdutores da coxa - parte externa das coxas",
        "pernas",
        ["/images/workouts/treino-a/cadeiraabdutora.gif"]
      )
    ],
    totalExercises: 13,
    totalSets: 41,
    duration: 90,
    backgroundImage: "/images/workouts/treino-a/background.webp"
  },
  {
    id: 'B',
    name: 'Treino B',
    focus: 'Costas + Trapézio + Bíceps + Antebraço + Perna Posterior + Panturrilha',
    groups: ['costas', 'trapezio', 'biceps', 'antebraco', 'posterior', 'panturrilha'],
    exercises: [

      createBasicExercise(
        1,
        "Barra fixa ou puxada frente",
        "4x 6–8",
        "Grande dorsal (largura) - desenvolvimento das costas",
        "costas",
        [
          "/images/workouts/treino-b/barrafixa.gif",
          "/images/workouts/treino-b/puxadafrente.gif"
        ]
      ),
      createBasicExercise(
        2,
        "Remada baixa",
        "3x 10–12",
        "Costas médias - foco na parte central",
        "costas",
        ["/images/workouts/treino-b/remadabaixa.gif"]
      ),
      createBasicExercise(
        3,
        "Remada curvada barra",
        "3x 8–10",
        "Espessura das costas - desenvolvimento da espessura",
        "costas",
        ["/images/workouts/treino-b/remadacurvada.webp"]
      ),
      
      createBasicExercise(
        4,
        "Elevação posterior",
        "3x 12–15",
        "Ombro posterior - desenvolvimento dos deltóides posteriores",
        "trapezio",
        [
          "/images/workouts/treino-b/elevacaoposterior.gif",
          "/images/workouts/treino-b/maquinaposterior.gif"
        ]
      ),
      createBasicExercise(
        5,
        "Encolhimento barra",
        "4x 10–12",
        "Trapézio superior - desenvolvimento dos trapézios",
        "trapezio",
        ["/images/workouts/treino-b/encolhimento.gif"]
      ),
      
      createBasicExercise(
        6,
        "Rosca direta",
        "3x 8–10",
        "Cabeça curta e longa do bíceps - desenvolvimento completo",
        "biceps",
        ["/images/workouts/treino-b/roscadireta.gif"]
      ),
      createBasicExercise(
        7,
        "Rosca alternada inclinada",
        "3x 10–12",
        "Ênfase cabeça longa do bíceps - pico do bíceps",
        "biceps",
        ["/images/workouts/treino-b/roscainclinada.gif"]
      ),
      
      createBasicExercise(
        8,
        "Rosca punho",
        "3x 15–20",
        "Flexores do antebraço - desenvolvimento dos antebraços",
        "antebraco",
        [
          "/images/workouts/treino-b/roscapunho1.gif",
          "/images/workouts/treino-b/roscapunho2.gif"
        ]
      ),
      createBasicExercise(
        9,
        "Rosca punho reversa",
        "3x 15–20",
        "Extensores do antebraço - equilíbrio muscular",
        "antebraco",
        [
          "/images/workouts/treino-b/roscapunho-reversa1.gif",
          "/images/workouts/treino-b/roscapunho-reversa2.gif"
        ]
      ),
      
      createBasicExercise(
        10,
        "Levantamento terra romeno",
        "4x 6–8",
        "Posterior + Glúteo - desenvolvimento da cadeia posterior",
        "posterior",
        [
          "/images/workouts/treino-b/levantamentoterra.gif",
          "/images/workouts/treino-b/stiff.gif"
        ]
      ),
      createBasicExercise(
        11,
        "Mesa flexora",
        "3x 10–12",
        "Posterior da coxa - isolamento do posterior",
        "posterior",
        ["/images/workouts/treino-b/mesaflexora.webp"]
      ),
      createBasicExercise(
        12,
        "Cadeira flexora",
        "3x 10",
        "Quadríceps + Glúteo",
        "posterior",
        ["/images/workouts/treino-b/cadeiraflexora.gif"]
      ),
      
      createBasicExercise(
        13,
        "Panturrilha em pé",
        "4x 10–15",
        "Panturrilha (gastrocnêmio) - desenvolvimento das panturrilhas",
        "panturrilha",
        ["/images/workouts/treino-b/panturrilha-pe.gif"]
      ),
      createBasicExercise(
        14,
        "Panturrilha sentada",
        "3x 15–20",
        "Panturrilha (sóleo) - parte inferior das panturrilhas",
        "panturrilha",
        ["/images/workouts/treino-b/panturrilha-sentada.gif"]
      )
    ],
    totalExercises: 14,
    totalSets: 44,
    duration: 90,
    backgroundImage: "/images/workouts/treino-b/background.jpg"
  }
];