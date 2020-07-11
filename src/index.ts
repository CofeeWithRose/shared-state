import { useState, useMemo, useRef, Reducer, SetStateAction, ReducerState, ReducerAction, Dispatch, useEffect } from 'react'
import {  TeleStateInterface, TeleState, UpdatePlugin } from './tele-state'

let stateId = 0

const useTele = <R extends Reducer<any, any>>( 
  teleState: TeleStateInterface<ReducerState<R>, ReducerAction<R>> 
  ) => {
  const [ _, setState ]= useState<ReducerState<R>>(teleState.value)
  const idRef = useRef(useMemo(() => stateId++, []))
  teleState.setStateMap[idRef.current] = setState
  useEffect(() => () =>{delete teleState.setStateMap[idRef.current]} ,[])
  const result:[ReducerState<R>, Dispatch<ReducerAction<R>>] =  [ teleState.value, teleState.dispatch ]
  return result
}


const createTeleReducer = <R extends Reducer<any, any>>(
  reducer: R,
  initState: ReducerState<R>, 
) => {
  const teleState: TeleStateInterface<ReducerState<R>, ReducerAction<R>> = 
  new TeleState<ReducerState<R>, ReducerAction<R>>(initState, reducer)
  return {
    useTeleReducer: () => useTele<R>(teleState),
    reset: () => teleState.setState(initState),
    apply: teleState.apply,
    
  }
}


const stateReducer = <S>(preState: S, action: SetStateAction<S>) => {
  if(typeof action === 'function'){
    return (action as (preState: S) => S )(preState)
  }else{
    return action
  }
} 

const createTeleState = <S>(initialState: SetStateAction<S>) => {
  const { useTeleReducer, ...rest } = createTeleReducer<Reducer<S, SetStateAction<S> >>( stateReducer, stateReducer(null, initialState ))
  return {
    useTeleState: useTeleReducer,
    ...rest,
  }
}

export { createTeleReducer, createTeleState }
