import { StepScene } from '@vk-io/scenes';
import { Keyboard } from 'vk-io';

export const registrationScene = new StepScene('registration', [
    async (context) => {
        context.session.state = "registration";
        await saveUserState({peerId: context.peerId, state: "registration"});

        const cmd = context.messagePayload?.cmd;

        if (context.scene.step.firstTime) {
            const keyboard = Keyboard.builder()
                .textButton({ label: "Для взрослого", payload: { cmd: "adult" } })
                .textButton({ label: "Для ребенка", payload: { cmd: "child" } }).oneTime();
            return context.send({
                message: "Выберите формат учётной записи",
                keyboard: keyboard,
            });
        }

        if (cmd === "adult" || cmd === "child") {
            context.scene.state.child = cmd === "adult" ? false : true;
            return context.scene.step.next();
        }
    },

    async (context) => {
        const cmd = context.messagePayload?.cmd;

        if (context.scene.step.firstTime) {
            const keyboard = Keyboard.builder()
                .textButton({ label: "Мужской", payload: { cmd: "male" } })
                .textButton({ label: "Женский", payload: { cmd: "female" } }).oneTime();
            return context.send({
                message: `${context.scene.state.child ? "Укажите пол ребёнка" : "Укажите ваш пол"}`,
                keyboard: keyboard,
            });
        }

        if (cmd === "male" || cmd === "female") {
            context.scene.state.gender = cmd;

            if (context.scene.state.changeGender) {
                return context.scene.step.go(9);
            }

            return context.scene.step.next();
        }
    },

    async (context) => {
        if (context.scene.step.firstTime) {
            return context.send({
                message: `${context.scene.state.child ? "Введите имя ребёнка" : "Введите ваше имя"}`,
            });
        }

        context.scene.state.name = context.text?.trim();

        if (context.scene.state.changeName) {
            return context.scene.step.go(9);
        }
        return context.scene.step.next();
    },

    async (context) => {
        if (context.scene.step.firstTime) {
            return context.send({
                message: `${context.scene.state.child ? "Введите фамилию ребёнка" : "Введите вашу фамилию"}`,
            });
        }

        context.scene.state.surname = context.text?.trim();

        if (context.scene.state.changeSurname) {
            return context.scene.step.go(9);
        }
        return context.scene.step.next();
    },

    async (context) => {
        if (context.scene.step.firstTime) {
            return context.send({ message: `${context.scene.state.child ? "Укажите дату рождения ребёнка (в формате ДД.ММ.ГГГГ)" : "Укажите дату вашего рождения (в формате ДД.ММ.ГГГГ)"}` });
        }

        const birthdate = context.text?.trim();

        if (!isValidDate(birthdate!)) {
            return context.send({
                message: 'Некорректная дата.\n Введите в формате ДД.ММ.ГГГГ (например: 01.01.2000):',
            });
        }

        context.scene.state.birthdate = birthdate;

        if (context.scene.state.changeBirthDate) {
            return context.scene.step.go(9);
        }

        return context.scene.step.next();
    },

    async (context) => {
        if (context.scene.step.firstTime) {
            if (context.scene.state.child) {
                return context.send({
                    message: 'Введите ваше имя',
                });
            }
            else {
                return context.scene.step.next();
            }
        }

        context.scene.state.parentName = context.text?.trim();

        if (context.scene.state.changeParentName) {
            return context.scene.step.go(9);
        }

        return context.scene.step.next();
    },

    async (context) => {
        if (context.scene.step.firstTime) {
            if (context.scene.state.child) {
                return context.send({
                    message: 'Введите вашу фамилию',
                });
            }
            else {
                return context.scene.step.next();
            }
        }

        context.scene.state.parentSurname = context.text?.trim();

        if (context.scene.state.changeParentSurname) {
            return context.scene.step.go(9);
        }

        return context.scene.step.next();
    },

    async (context) => {
        if (context.scene.step.firstTime) {
            return context.send({ message: `${context.scene.state.child ? "Укажите ваш контактный телефон (+71234567890)" : "Укажите контактный телефон (+71234567890)"}` });
        }

        const phone = context.text?.trim();

        if (!isValidPhone(phone!)) {
            return context.send({
                message: 'Некорректный номер.\n Введите российский номер телефона (например: +79012345678)',
            });
        }

        context.scene.state.phone = phone;

        if (context.scene.state.changePhone) {
            return context.scene.step.go(9);
        }

        return context.scene.step.next();
    },

    async (context) => {
        if (context.scene.step.firstTime) {
            return context.send({ message: `${context.scene.state.child ? "Укажите вашу электронную почту" : "Укажите электронную почту"}` });
        }

        const email = context.text?.trim();

        if (!isValidEmail(email!)) {
            return context.send({
                message: 'Некорректный email.\n Попробуйте ещё раз (например: klient@mail.ru):',
            });
        }

        context.scene.state.email = email;

        if (context.scene.state.changeEmail) {
            return context.scene.step.go(9);
        }

        return context.scene.step.next();
    },

    async (context) => {
        const gender = context.scene.state.gender;
        const name = context.scene.state.name;
        const surname = context.scene.state.surname;
        const birthdate = context.scene.state.birthdate;
        const phone = context.scene.state.phone;
        const email = context.scene.state.email;
        const parentName = context.scene.state.parentName;
        const parentSurname = context.scene.state.parentSurname;
        const cmd = context.messagePayload?.cmd;

        if (context.scene.step.firstTime) {
            const keyboard = Keyboard.builder()
                .textButton({ label: "Данные заполнены верно", color: Keyboard.POSITIVE_COLOR, payload: { cmd: "confirm" } }).row()
                .textButton({ label: "Указать другой пол", payload: { cmd: "changeGender" } }).row()
                .textButton({ label: `${context.scene.state.child ? "Поменять имя ребенка" : "Поменять имя"}`, payload: { cmd: "changeName" } }).row()
                .textButton({ label: `${context.scene.state.child ? "Поменять фамилию ребенка" : "Поменять фамилию"}`, payload: { cmd: "changeSurname" } }).row()
                .textButton({ label: `${context.scene.state.child ? "Поменять дату рождения ребенка" : "Поменять дату рождения"}`, payload: { cmd: "changeBirthDate" } }).row()
                .textButton({ label: "Поменять номер телефона", payload: { cmd: "changePhone" } }).row()
                .textButton({ label: "Поменять почту", payload: { cmd: "changeEmail" } }).row().oneTime()

            if (context.scene.state.child) {
                keyboard.textButton({ label: "Поменять имя родителя", payload: { cmd: "changeParentName" } }).row();
                keyboard.textButton({ label: "Поменять фамилию родителя", payload: { cmd: "changeParentSurname" } }).row().oneTime();
            }


            return context.send({
                message: `Проверьте ваши данные

                ${context.scene.state.child ? "Анкета ребёнка" : "Анкета"}
                ──────────────────────
                ${context.scene.state.child ? "Пол ребёнка" : "Пол"}: ${gender}
                ${context.scene.state.child ? "Имя ребёнка" : "Имя"}: ${name}
                ${context.scene.state.child ? "Фамилия ребёнка" : "Фамилия"}: ${surname}
                ${context.scene.state.child ? "Дата рождения ребёнка" : "Дата рождения"}: ${birthdate}
                ${context.scene.state.child ? "Имя родителя" : ""}${context.scene.state.child ? `: ${parentName}` : ""}
                ${context.scene.state.child ? "Фамилия родителя" : ""}${context.scene.state.child ? `: ${parentSurname}` : ""}
                Телефон: ${phone}
                Email: ${email}`,

                keyboard: keyboard,
            });
        }

        if (cmd === "confirm") {
            return context.scene.step.next();
        }

        if (cmd === "changeGender") {
            context.scene.state.changeGender = true;
            return context.scene.step.go(1);
        }

        if (cmd === "changeName") {
            context.scene.state.changeName = true;
            return context.scene.step.go(2);
        }

        if (cmd === "changeSurname") {
            context.scene.state.changeSurname = true;
            return context.scene.step.go(3);
        }

        if (cmd === "changeBirthDate") {
            context.scene.state.changeBirthDate = true;
            return context.scene.step.go(4);
        }

        if (cmd === "changeParentName") {
            context.scene.state.changeParentName = true;
            return context.scene.step.go(5);
        }

        if (cmd === "changeParentSurname") {
            context.scene.state.changeParentSurname = true;
            return context.scene.step.go(6);
        }

        if (cmd === "changePhone") {
            context.scene.state.changePhone = true;
            return context.scene.step.go(7);
        }

        if (cmd === "changeEmail") {
            context.scene.state.changeEmail = true;
            return context.scene.step.go(8);
        }
    },

    async (context) => {
        const gender = context.scene.state.gender;
        const name = context.scene.state.name;
        const surname = context.scene.state.surname;
        const birthdate = context.scene.state.birthdate;
        const phone = context.scene.state.phone;
        const email = context.scene.state.email;
        const parentName = context.scene.state.parentName;
        const parentSurname = context.scene.state.parentSurname;
        const isChild = context.scene.state.child;
        let registration = false;

        if (context.scene.step.firstTime) {
            const key = generateCode();
            
            if (isChild) {
                registration = await createNewUser(isChild, gender, name, surname, birthdate, phone, email, key, parentName, parentSurname);
            }
            else {
                registration = await createNewUser(isChild, gender, name, surname, birthdate, phone, email, key);
            }

            if (registration) {
                await saveUserState({peerId: context.peerId, key: key, role: "CLIENT"});
                context.send("Регистрация прошла успешно");
                return context.scene.enter("trialLessons");
            }
            else {
                context.send("Ошибка во время регистрации");
                return context.scene.leave();
            }
        }
    }
]);