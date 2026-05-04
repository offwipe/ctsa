import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { PomodoroProvider } from './context/PomodoroContext'
import { LayoutPresetProvider } from './context/LayoutPresetContext'
import { AppLayout } from './components/Layout/AppLayout'
import { HomeScreen } from './screens/Home/HomeScreen'
import { StudyScreen } from './screens/Study/StudyScreen'
import { ExamScreen } from './screens/Exam/ExamScreen'
import { SubnettingScreen } from './screens/Subnetting/SubnettingScreen'
import { PBQScreen } from './screens/PBQ/PBQScreen'
import { FlashcardsScreen } from './screens/Flashcards/FlashcardsScreen'
import { PomodoroScreen } from './screens/Pomodoro/PomodoroScreen'
import { CCSTMinigamesScreen } from './screens/CCSTMinigames/CCSTMinigamesScreen'
import { SettingsScreen } from './screens/Settings/SettingsScreen'

function App() {
  return (
    <AppProvider>
      <PomodoroProvider>
        <LayoutPresetProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomeScreen />} />
                <Route path="study" element={<StudyScreen />} />
                <Route path="exam" element={<ExamScreen />} />
                <Route path="subnetting" element={<SubnettingScreen />} />
                <Route path="pbq" element={<PBQScreen />} />
                <Route path="flashcards" element={<FlashcardsScreen />} />
                <Route path="pomodoro" element={<PomodoroScreen />} />
                <Route path="ccst-minigames" element={<CCSTMinigamesScreen />} />
                <Route path="settings" element={<SettingsScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LayoutPresetProvider>
      </PomodoroProvider>
    </AppProvider>
  )
}

export default App
