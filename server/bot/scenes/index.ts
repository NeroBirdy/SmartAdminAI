import { sceneManager } from '../middlewares';
import { loginScene } from './login.scene';
import { startScene } from './start.scene';
import { logoutScene } from './logout.scene';
import { chooseCityScene } from './chooseCity.scene';
import { chooseOrganizationScene } from './chooseOrganization.scene';
import { chooseProgramScene } from './chooseProgram.scene';
import { scheduleManagementScene } from './scheduleManagement.scene';
import { registrationScene } from './registration.scene';
import { trialLesonsScene } from './trialLessons.scene';
import { askQuestionScene } from './askQuestion.scene';

export function registerScenes() {
    sceneManager.addScenes([
        loginScene,
        startScene,
        logoutScene,
        chooseCityScene,
        chooseOrganizationScene,
        chooseProgramScene,
        scheduleManagementScene,
        registrationScene,
        trialLesonsScene,
        askQuestionScene,
    ]);
}