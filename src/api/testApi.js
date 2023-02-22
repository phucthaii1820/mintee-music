import HttpUtility from './HttpUtility'

export const getTest = () => {
  return HttpUtility.get('https://jsonplaceholder.typicode.com/todos')
}
