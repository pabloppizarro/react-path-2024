import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import "./App.css";
import expensiveMathOperation from "./utils/expensiveMathOperation.js";
const TwittersContext = createContext(0);
const AuthContext = createContext({
  user: null,
});

interface Tweet {
  title: string;
  text: string;
  likesCount: number;
  urlMedia: string;
  children: JSX.Element;
}
const tweets: Tweet[] = [
  {
    title: "useState",
    text: "es la forma mas basica de manejar estado, pero ojo. Cuando cambiemos el estado estamos repintando todo el componente. Mira la consola.",
    urlMedia: "",
    likesCount: 34,
    children: <UseStateComponent />,
  },
  {
    title: "useRef",
    text: "cuando queremos persistir un estado entre re renders. Pero al no repintar, no vas a ver el cambio en el DOM, seguira siendo 1 el valor ",
    urlMedia: "",
    likesCount: 34,
    children: <UseRefComponent />,
  },
  {
    title: "useRef con interval y useEffect",
    text: "usamos el useRef para mantener la referencia al interval (id) entre cada repintado para luego poder frenar el timer, de otro modo la referencia se pierde",
    urlMedia: "",
    likesCount: 34,
    children: <UseRefTimerComponent />,
  },
  {
    title: "useRef de elemento HTML",
    text: "Ahora vamos a mantener una referencia a un elemento HTML al que vamos a poder manipular. Siempre sera el mismo porque al repintar se va a volver a reconstruir el input pero no perdemos la referencia.",
    urlMedia: "",
    likesCount: 34,
    children: <UseRefElementComponent />,
  },
  {
    title: "useReducer!",
    text: "Una forma mas elegante de manejar estado es useReducer. Tambien es recomendable en el caso de que necesitemos funciones mas complejas para obtener estado.",
    urlMedia: "",
    likesCount: 34,
    children: <UseReducerComponent />,
  },
  {
    title: "useMemo I!",
    text: "Supongamos que tenemos una operacion matematica muy costosa como Fibonacci, claramente no queremos realizarla en cada repintado. Solo lo haremos al cambiar el contador. Solo se realiza 1 vez y nuestra animacion sigue de forma suave.",
    urlMedia: "",
    likesCount: 34,
    children: <UseMemoFibonacci />,
  },
];

function App() {
  const { total } = useContext(TwittersContext);
  const [totalLikes, setTotalLikes] = useState(0);
  const [user, authUser] = useState(null);
  // const { user } = useContext(AuthContext);

  const addLikes = useCallback(() => {
    setTotalLikes((prev) => prev + 1);
  }, []);

  const handleAuth = () => authUser({ name: "pachu.dev" });
  return (
    <>
      <AuthContext.Provider value={{ user }}>
        <h1>React Hooks guía 2024</h1>
        <div className="authContext">
          <small>Este es el AuthContext</small>
          {!user ? (
            <>
              <button onClick={handleAuth}>Login! </button>
            </>
          ) : (
            <p>Bienvenido {user?.name}!</p>
          )}
        </div>
      </AuthContext.Provider>
      <small>Aca comienza el TwitterContext</small>
      <TwittersContext.Provider value={totalLikes}>
        <h2>Listado de tweets</h2>
        <p>total likes: {totalLikes}</p>
        <section className="list">
          {tweets.map((tweet) => (
            <>
              <Tweet key={tweet.title} props={tweet} likesCb={addLikes}>
                {tweet.children}
              </Tweet>
            </>
          ))}
        </section>
      </TwittersContext.Provider>
    </>
  );
}

export default App;

const Tweet = ({
  props,
  likesCb,
}: {
  props: Tweet;
  likesCb: object;
  children: ReactNode;
}) => {
  return (
    <>
      <article className="card">
        <div className="twitHeader">
          <p>@pachu.dev</p>
          <h1 className="twitTitle">{props.title}</h1>
          <button onClick={likesCb} className="flat">
            ❤️
          </button>
          {/* <p>total posts: {total}</p> */}
        </div>
        <div className="area">
          <p id="area">{props.text}</p>
        </div>
        <div className="children">{props.children}</div>
      </article>
    </>
  );
};

function UseStateComponent({ props = {} }) {
  const [likesCount, setLikesCount] = useState<number>(1);
  const rerenders = useRef(0);
  const handleClick = () => {
    setLikesCount(likesCount + 1);
  };
  console.log("Render UseStateComponent");
  return (
    <>
      <button onClick={handleClick}>Likes count: {likesCount}</button>
      <br></br>
      <small>re-renders: {++rerenders.current}</small>
    </>
  );
}

function UseRefComponent({ props = {} }) {
  const likesRef = useRef(1);
  const rerenders = useRef(0);
  const handleClick = () => {
    likesRef.current++;
    console.log("useRef likes: ", likesRef.current);
  };
  console.log("Render UseRefComponent");
  return (
    <>
      <p>mira la consola</p>
      <button onClick={() => handleClick()}>like! {likesRef.current}</button>
      <br></br>
      <small>re-renders: {++rerenders.current}</small>
    </>
  );
}
function UseRefTimerComponent({ props = {} }) {
  const [likes, setLikes] = useState(0);
  const timer = useRef(0);
  const rerenders = useRef(0);
  useEffect(() => {
    timer.current = setInterval(() => setLikes((likes) => likes + 1), 1000);
    console.log("timer id:", timer.current);
  }, []);

  const handleStop = () => {
    console.log("frenando timer id:", timer.current);
    clearInterval(timer.current);
    timer.current = 0;
  };
  return (
    <>
      {/* <p>mira la consola</p> */}
      <button onClick={handleStop}>Parar! {likes}</button>
      <br></br>
      <small>re-renders: {++rerenders.current}</small>
    </>
  );
}

function UseRefElementComponent({ props = {} }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rerenders = useRef(0);
  const onFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.border = "3px solid white";
    }
  };
  return (
    <>
      <input type="text" ref={inputRef} />
      <button onClick={onFocus}>Focus text!</button>
      <br></br>
      <small>re-renders: {++rerenders.current}</small>
    </>
  );
}
// reducer example
const reducer = (state, action) => {
  switch (action.type) {
    case "add":
      return ++state;
    case "pow":
      return state * state;
    default:
      return state;
  }
};

function UseReducerComponent() {
  const rerenders = useRef(0);
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <>
      <p>Likes {count}</p>
      <button onClick={() => dispatch({ type: "add" })}>Add!</button>
      <button onClick={() => dispatch({ type: "pow" })}>pow!</button>
      <br></br>
      <small>re-renders: {++rerenders.current}</small>
    </>
  );
}

function UseMemoFibonacci() {
  const [count, setCount] = useState(10);
  const [left, setLeft] = useState(0);
  const value = useMemo(() => expensiveMathOperation(count), [count]);
  const rerenders = useRef(0);
  // let rerender = useRef(0);
  useEffect(() => {
    requestAnimationFrame(animate);
    function animate() {
      setLeft(left + 1);
    }
  }, [left]);
  return (
    <div>
      <div
        style={{ left: `${Math.sin(left * 0.05) * 100 + 100}px` }}
        className="ball"
      ></div>
      <h3>
        Calculos: {count} <button onClick={() => setCount(count + 1)}>+</button>
      </h3>
      <h3>Resultados de Fibonacci: {value}</h3>
      <br></br>
      <small>re-renders: {++rerenders.current}</small>
    </div>
  );
}
