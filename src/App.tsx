import { FrameDisplayer } from "./components/FrameDisplayer";
import { MenuContainer } from "./components/MenuContainer";
import { DragElementDisplayer } from "./components/DragElementDisplayer";
import { Route, Routes } from "react-router-dom";
import { CreateElementRoute } from "./components/CreateElementRoute";

export default function App() {
    return (
        <>
            <div
                className="absolute top-0 left-0 w-full h-full bg-fuchsia-300 font-sans text-2xl flex flex-col"
            >
                <header  className="relative">
                    LIGMA - app for design UI
                </header>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/create" element={<Create/>} />
                </Routes>
            </div>
            <MenuContainer/>
        </>
    )
}

function Home() {
    return (
        <>
            <div
                className="relative w-full h-full"
            >
                <FrameDisplayer/>
            </div>
            <footer className="relative">
                <DragElementDisplayer/>
            </footer>
        </>
    )
}

function Create() {
    return <CreateElementRoute/>
}