# Hook

> Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性.

* Hook 使你在无需修改组件结构的情况下复用状态逻辑 （自定义Hook）
* Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据 Effect Hook）
* Hook 使你在非 class 的情况下可以使用更多的 React 特性
* Hook 和现有代码可以同时工作，你可以渐进式地使用他们

## useState

* 为什么要使用useState？

在 Hooks 出现之前，当我们想要在函数组件内拥有自己的 `state` 时，需要改写为 `class`. 并且状态绑定在 `this` 中

* 使用

```js
const [name, setName] = useState('Jack')
```

`name` 为当前组件的状态，通过 `setName('Tom')` 方法来更改，命名自定义，相当于 `class` 中的 `this.setState()`. 在初始化时 使用 `useState('Jack')` 为 `name` 赋值为 `Jack`. 

```js
const Example = (props) => {
  // 你可以在这使用 Hook
  return <div />;
}

// or
function Example(props) {
  // 你可以在这使用 Hook
  return <div />;
}
```

* Hook 在 `class` 内部是不起作用的。但你可以使用它们来取代 `class`。

## useEffect

Effect Hook 将 `class` 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 合为一体，跟 `useState` 一样，你可以在组件中多次使用 `useEffect`.

```js
useEffect(() => {
  const subscription = props.source.subscribe()
  return () => {
    subscription.unsubscribe()
  }
}, [props.source])
```

可以使用 (eslint-plugin-react-hooks)[https://www.npmjs.com/package/eslint-plugin-react-hooks#installation] 中的 (exhaustive-deps)[https://github.com/facebook/react/issues/14920] 规则，会在添加错误依赖时发出警告并给出修复建议。

## useContext

可以在组件之间共享状态

```js
const value = useContext(MyContext)
```

接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定。

当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context value 值。即使祖先使用 React.memo 或 shouldComponentUpdate，也会在组件本身使用 useContext 时重新渲染。

例子

```js
import React, { useContext } from "react"

const TestContext= React.createContext({});

const Navbar = () => {
  const { username } = useContext(TestContext)

  return (
    <div className="navbar">
      <p>{username}</p>
    </div>
  )
}

const Messages = () => {
  const { username } = useContext(TestContext)

  return (
    <div className="messages">
      <p>1 message for {username}</p>
    </div>
  )
}

function App () {
  return (
    <TestContext.Provider 
      value={{
        username: 'superawesome'
      }}
    >
      <div className="test">
        <Navbar />
        <Messages />
      </div>
    </TestContext.Provider>
  )
}

export default App
```

## useReducer

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

`useState` 的替代方案. 它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法，

在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 dispatch 而不是回调函数。

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1}
    case 'decrement':
      return {count: state.count - 1}
    default:
      throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  )
}
```

你可以选择惰性地创建初始 state。为此，需要将 init 函数作为 useReducer 的第三个参数传入，这样初始 state 将被设置为 init(initialArg)。这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利：

```js
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount = 0}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

## useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

在a和b的变量值不变的情况下，memoizedValue的值不变。即：useMemo函数的第一个入参函数不会被执行，从而达到节省计算量的目的。

```js
import React, { useState, useMemo } from "react"

function Comp({ name, children }) {
  function changeName(name) {
    console.log('11')
    return name + '改变name的方法'
  }
  const otherName =  changeName(name)
  // const otherName =  useMemo(() => changeName(name), [name])
  return (
      <>
        <div>{otherName}</div>
        <div>{children}</div>
      </>

  )
}

function App() {
  const [name, setName] = useState('名称')
  const [content,setContent] = useState('内容')
  return (
      <>
        <button onClick={() => setName(new Date().getTime())}>name</button>
        <button onClick={() => setContent(new Date().getTime())}>content</button>
        <Comp name={name}>{content}</Comp>
      </>
  )
}

export default App
```

当我们只改变 `content` 值时，changeName 方法会被调用，使用 useMemo 方法，可以避免无用方法的调用。

## useCallback

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

在a和b的变量值不变的情况下，memoizedCallback的引用不变。即：useCallback的第一个入参函数会被缓存，从而达到渲染性能优化的目的.

(useMemo & useCallback)[https://kentcdodds.com/blog/usememo-and-usecallback/]

## React.memo、useCallback、useMemo

问题：React 中 props 或 state 变化时，会重新渲染，实际开发会遇到不必要的渲染场景

```js
function ChildComp () {
  console.log('render child-comp ...')
  return <div>Child Comp ...</div>
}

function ParentComp () {
  const [ count, setCount ] = useState(0)
  const increment = () => setCount(count + 1)

  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <ChildComp />
    </div>
  );
}
```

击父组件中按钮，会修改 count 变量的值，进而导致父组件重新渲染，此时子组件压根没有任何变化(props、state)，但在控制台中仍然看到子组件被渲染的打印信息.

我们希望子组件的 prop 和 state 没有变化时，即便父组件渲染，也不要渲染子组件。

**用 memo 修改**

```js
import React, { memo, useState } from 'react'

let ChildComp = function () {
  console.log('render child-comp ...')
  return <div>Child Comp ...</div>
}

ChildComp = memo(ChildComp)

function ParentComp () {
  const [ count, setCount ] = useState(0)
  const increment = () => setCount(count + 1)

  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <ChildComp />
    </div>
  );
}
```

**传入子组件 props**，props 的值未发生变化，子组件重新渲染。

```js
import React, { memo, useState } from 'react'

const ChildComp = memo(function ({ name, onClick }) {
  console.log('render child-comp ...')
  return <>
    <div>Child Comp ... {name}</div>
    <button onClick={() => onClick('hello')}>改变 name 值</button>
  </>
})

function ParentComp () {
  const [ count, setCount ] = useState(0)
  const increment = () => setCount(count + 1)

  const [ name, setName ] = useState('hi~')
  const changeName = (newName) => setName(newName)  // 父组件渲染时会创建一个新的函数

  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <ChildComp name={name} onClick={changeName}/>
    </div>
  );
}
```

解决这个问题，我们可以使用 `useCallback` 进行优化

```js
const changeName = useCallback((newName) => setName(newName), []) 
```

将 changeName 放入 useCallback 中返回缓存的函数. 若使用 useMemo 相同原理，只不过 useMemo 会返回缓存的值.

```js
function ParentComp () {
  // ....
  const [ name, setName ] = useState('hi~')
  const [ age, setAge ] = useState(20)
  const changeName = useCallback((newName) => setName(newName), [])
  const info = useMemo(() => ({ name, age }), [name, age])   // 包一层

  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <ChildComp info={info} onClick={changeName}/>
    </div>
  );
}
```

## useRef

```js
const refContainer = useRef(initialValue)
```

useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现。

```js
import React, { useRef, memo, useState, useCallback, useEffect, useMemo } from 'react';

function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}

export default MeasureExample
```

## useDebugValue

```js
useDebugValue(value)
```

useDebugValue 可用于在 React 开发者工具（React Developer Tools）中显示自定义 hook 的标签。

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // 在开发者工具中的这个 Hook 旁边显示标签
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```