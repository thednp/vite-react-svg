import ReactIcon from "../src/react.svg?react";

const App = () => {
    return <>
        <h1>This is a simple demo</h1>
        <ReactIcon
            aria-hidden="false"
            className="icon"
            width={null} height={null}
            style={{ color: "deepskyblue", width: "16rem", height: 'auto' }}
        />
    </>
}

export default App;
