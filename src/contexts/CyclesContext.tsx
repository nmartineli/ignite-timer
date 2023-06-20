import { createContext, ReactNode, useReducer, useState } from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducers'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // USEREDUCER
  // o useReducer sempre vai receber dois parâmetros: uma função e o valor inicial da variável (no caso é o valor inicial dos ciclos)
  // a função recebe dois parâmetros: o estado em "tempo real" e a ação que o usuário está querendo realizar para atualizar o estado. pode ser por ex: add, interrupt, tudo o que altera o estado
  // por padrão, usamos dipatch como nome da ação que dispara um funcionamento
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    // STATE
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )

    // REDUCER
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    // STATE
    // sempre que uma alteração de estado depender do estado anterior, é indicado utilizar em forma de função (closures)
    // setCycles((state) => [...state, newCycle])

    // REDUCER
    // quando eu chamo o dispatch, precisa enviar uma informação que distingue uma action da outra. por padrão, usamos um objeto com type e payload
    // dispatch({
    //   // tipo da ação
    //   type: ActionTypes.ADD_NEW_CYCLE,
    //   // dados do novo ciclo que está sendo criado
    //   payload: {
    //     newCycle,
    //   },
    // })

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)

    // reset()
  }

  function interruptCurrentCycle() {
    // REDUCER

    dispatch(interruptCurrentCycleAction())

    // STATE
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
    // setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
