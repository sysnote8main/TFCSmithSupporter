import { batch, createEffect, createSignal, For } from "solid-js"
import { BendingType, BendTypeIcon } from "./BendIcon"
import { createLocalStore, Queue, removeIndex } from "./utils"


export const SmithList = () => {
  const [requireSteps, setRequireSteps] = createLocalStore<BendingType[]>("bending_types", [])

  const [target, setTarget] = createSignal(0)
  const [count, setCount] = createSignal(0)
  const [needSteps, setNeedSteps] = createSignal(0)
  const [stepResult, setStepResult] = createSignal<BendingType[]>([])

  createEffect(() => {
    setCount(requireSteps.reduce((a,b) => a+b, 0))
    setNeedSteps(target() - count())
  })

  const stepTypes = [
    BendingType.HIT_LIGHT,
    BendingType.HIT_MEDIUM,
    BendingType.HIT_HEAVY,
    BendingType.DRAW,
    BendingType.PUNCH,
    BendingType.BEND,
    BendingType.UPSET,
    BendingType.SHRINK,
  ]

  const addRequireStep = (newStep: BendingType) => {
    batch(() => {
      if(requireSteps.length === 3) {
        setRequireSteps(t => removeIndex(t, 0))
      }
      setRequireSteps(requireSteps.length, newStep)
    })
  }

  function calcMinimumStep(): Array<BendingType> | undefined {
    let targetNum = needSteps()
    if(targetNum === 0) {
      return requireSteps
    }
    const queue: Array<{nowSum: number, path: Array<BendingType>}> = [{nowSum: 0, path: []}]
    const visited: Set<number> = new Set([0])
    while(queue.length !== 0) {
      const now = queue.shift()
      if(now === undefined) break
      for(let num of stepTypes) {
        const newSum = now.nowSum + num.valueOf()
        if(newSum === targetNum) return [...now.path, num, ...requireSteps]
          if(!visited.has(newSum) && newSum < targetNum) {
            visited.add(newSum)
            queue.push({nowSum: newSum, path: [...now.path, num]})
          }
      }
    }
    return undefined
  }

  function calcStep() {
    const result = calcMinimumStep()
    if(result === undefined) return // TODO Add: Error system
    setStepResult(result)
  }

  return (
    <>
      <For each={stepTypes}>
        {(item, _) =>
          <button onClick={() => addRequireStep(item)}><BendTypeIcon type={item}/></button>
        }
      </For>
      <span class="text-2xl m-5">Target: <input type="number" style="width:100px;" onInput={(e) => setTarget(Number.parseInt(e.target.value))}/> Count: {count()} Needs: {needSteps()}  <button onClick={calcStep} class="bg-slate-400">Calc it!</button></span>
      <p class="h-16 m-5 text-2xl">
        Require Step: 
        <For each={requireSteps}>
          {(item, i) =>
            <button onClick={() => setRequireSteps((t) => removeIndex(t, i()))}><BendTypeIcon type={item}/></button>
          }
        </For>
      </p>
      <p class="m-3 text-2xl">
        Step: 
        <For each={stepResult()}>
          {(item, _) =>
            <><BendTypeIcon type={item}/></>
          }
        </For>
      </p>
    </>
  )
}





