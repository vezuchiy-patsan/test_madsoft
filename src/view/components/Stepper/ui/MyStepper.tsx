import {Box, Button, Step, StepLabel, Stepper, Typography} from "@mui/material";
import {useState} from "react";

enum typeAnswer{
    checkbox = "checkbox",
    radio = "radio",
    text = "text"
}

interface questionSteps {
    name: string,
    type: typeAnswer,
    variants: Array<string>
}

const steps: questionSteps[] = [
    {name: 'Как правильно мы называем файл который создаем самым первым?', type: typeAnswer.radio,
        variants: ["index.html", "JavaScript.js", "style.css"]},
    {name:'Выберите неправильный ответ.', type: typeAnswer.checkbox,
        variants: ["строчный тэг как и блочный неможет размещать ряом другие тэги",
                "строчным тэгам можно дать ширину и высоту",
                "фотография обладает строчно-блочным свойством"]},
    {name:'Какое свойство отвечает за превращения из блочного тэга в строчный?', type: typeAnswer.text, variants: []},
];

export function MyStepper() {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [completed, setCompleted] = useState<{ [k: number]: boolean; }>({});

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    // шаг вперёд
    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                  // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };
    // шаг назад
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        setCompleted({
            ...completed,
            [activeStep]: true,
        });
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };
    return (
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(({name: label}, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                    <>
                        <Typography sx={{mt: 2, mb: 1}}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography sx={{mt: 2, mb: 1, py: 1}}>
                            Step {activeStep + 1}
                        </Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography variant="caption" sx={{display: 'inline-block'}}>
                                        Step {activeStep + 1} already completed
                                    </Typography>
                                ) : (completedSteps() !== totalSteps() &&
                                    <Button onClick={handleComplete}>
                                        Ответить
                                    </Button>
                                ))}
                        </Box>
                    </>
                )}
            </div>
        </Box>
    );
}