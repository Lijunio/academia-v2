// src/data/exercises.data.ts
import { Exercise } from '../types/workout.types';

const createExercise = (
  id: number,
  name: string,
  sets: string,
  description: string,
  muscleGroup: 'peito' | 'ombro' | 'triceps' | 'pernas' | 'costas' | 'biceps',
  images: string[]
): Exercise => ({
  id,
  name,
  sets,
  description,
  muscleGroup,
  images,
  completed: false,
  started: false,
  reps: 10,
  restTime: 60
});

export const exercisesA: Exercise[] = [
  createExercise(
    1,
    "Supino reto (barra)",
    "4x 6–8",
    "Peitoral médio - foco no desenvolvimento do peitoral completo",
    "peito",
    ["/images/workouts/treino-a/supinoreto.webp"]
  ),
  createExercise(
    2,
    "Supino inclinado (halteres)",
    "3x 8–10",
    "Peitoral superior - ênfase na parte superior do peitoral",
    "peito",
    ["/images/workouts/treino-a/supinoinclinado.jpg"]
  ),
  createExercise(
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
  createExercise(
    4,
    "Desenvolvimento halteres",
    "3x 8–10",
    "Ombro anterior - desenvolvimento frontal dos deltóides",
    "ombro",
    ["/images/workouts/treino-a/desenvolvimento.webp"]
  ),
  createExercise(
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
  createExercise(
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
  createExercise(
    7,
    "Tríceps corda",
    "3x 10–12",
    "Cabeça lateral do tríceps - pico de contração",
    "triceps",
    ["/images/workouts/treino-a/tricepscorda.gif"]
  ),
  createExercise(
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
  createExercise(
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
  createExercise(
    10,
    "Leg Press 45°",
    "3x 10–12",
    "Quadríceps - carga controlada",
    "pernas",
    ["/images/workouts/treino-a/legpress.webp"]
  ),
  createExercise(
    11,
    "Cadeira extensora",
    "3x 12–15",
    "Quadríceps - isolamento perfeito",
    "pernas",
    ["/images/workouts/treino-a/cadeiraextensora.webp"]
  ),
  createExercise(
    12,
    "Cadeira adutora",
    "3x 12–15",
    "Adutores da coxa - parte interna das coxas",
    "pernas",
    ["/images/workouts/treino-a/cadeiraadutora.webp"]
  ),
  createExercise(
    13,
    "Cadeira abdutora",
    "3x 12–15",
    "Abdutores da coxa - parte externa das coxas",
    "pernas",
    ["/images/workouts/treino-a/cadeiraabdutora.gif"]
  )
];