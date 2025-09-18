import ReactDOM from 'react-dom/client';
import App from './App';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ProjectProvider } from './contexts/ProjectContext';
import { PropsHistoryProvider } from './contexts/PropsHistoryContext';
import { FrameProvider } from './contexts/FrameContext';
import { FocusPropsProvider } from './contexts/FocusPropsContext';
import { MenuProvider } from './contexts/MenuContext';
import { ScaleProvider } from './contexts/ScaleContext';
import { PropsOptionsProvider } from './contexts/PropsOptionsContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <DndProvider backend={HTML5Backend}>
            <ProjectProvider>
                <ScaleProvider>
                    <PropsOptionsProvider>
                        <PropsHistoryProvider>
                            <FrameProvider>
                                <FocusPropsProvider>
                                    <MenuProvider>
                                        <App/>
                                    </MenuProvider>
                                </FocusPropsProvider>
                            </FrameProvider>
                        </PropsHistoryProvider>
                    </PropsOptionsProvider>
                </ScaleProvider>
            </ProjectProvider>
        </DndProvider>
    </BrowserRouter>
)