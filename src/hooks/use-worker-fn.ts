import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Custom React hook to run a function in a web worker.
 * @param fn - Function to be executed in a web worker
 * @returns
 * - `execute`: Function to execute the worker function with provided arguments
 * - `isPending`: Boolean indicating if the worker is currently executing
 * - `isError`: Boolean indicating if there was an error during execution
 * @example Calculate Fibonacci in a worker
 * const fib = (n: number): number => (n <= 1 ? n : fib(n - 1) + fib(n - 2));
 * const { execute, isPending, isError } = useWorkerFn(fib);
 * const result = await execute(100000); // result will be the 100000th Fibonacci number
 */
export function useWorkerFn<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult
): {
  execute: (...args: TArgs) => Promise<TResult>
  isPending: boolean
  isError: boolean
} {
  const workerRef = useRef<Worker | null>(null)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    // Create a worker blob from the function
    const blob = new Blob(
      [
        /* JavaScript */ `
            self.onmessage = async (e) => {
               const { rawFunction, args } = e.data;
               const fn = new Function('return ' + rawFunction)();
               const result = await fn(...args);
               self.postMessage(result);
            }`,
      ],
      { type: 'application/javascript' }
    )

    workerRef.current = new Worker(URL.createObjectURL(blob))

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      setIsPending(true)
      setIsError(false)
      try {
        return await new Promise((resolve, reject) => {
          if (!workerRef.current) {
            reject(new Error('Worker is not initialized'))
            return
          }

          const rawFunction = fn.toString()

          workerRef.current.onmessage = (e) => {
            resolve(e.data)
          }

          workerRef.current.onerror = (e) => {
            reject(e.message)
          }

          workerRef.current.postMessage({ rawFunction, args })
        })
      } catch (error) {
        setIsError(true)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    [fn]
  )

  return { execute, isPending, isError }
}
