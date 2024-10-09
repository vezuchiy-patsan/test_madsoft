import {
    Box,
    Button,
    Checkbox, FormControl,
    FormControlLabel,
    FormGroup, Radio,
    RadioGroup,
    Step,
    StepLabel,
    Stepper, TextField,
    Typography
} from "@mui/material";
import {ReactNode, useCallback, useState} from "react";
import {FormProvider, useForm, useFormContext} from "react-hook-form";

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
    {name:'Какое свойство отвечает за превращения из блочного тэга в строчный?', type: typeAnswer.text, variants: []}
];

type switchInputProps = {
    type: string,
    variants: questionSteps["variants"],
    activeStep: number
}

type formInput = {
    "radio.0": string,
    "check.0": string
}

function SwitchInput({type, variants, activeStep} : switchInputProps){
    const {register} = useFormContext();

    switch (type){
        case typeAnswer.checkbox:
            return (
                <FormGroup>
                    {variants.map((variant, index): ReactNode => (
                        <FormControlLabel
                            value={variant}
                            control={<Checkbox key={index} {...register(`check-${activeStep}`)} />}
                            label={variant} />
                    ))}
                </FormGroup>
            )

        case typeAnswer.radio:
            return (
                <RadioGroup name="radio-buttons">
                    {variants.map((variant, index): ReactNode => (
                        <FormControlLabel
                            value={variant}
                            key={index}
                            control={<Radio {...register(`radio-${activeStep}`)} />}
                            label={variant} />
                    ))}
                </RadioGroup>
            );
        case typeAnswer.text:
            return(
                <>
                    <TextField
                        id={activeStep.toString()}
                        label="Введите текст"
                        multiline
                        rows={4}
                        defaultValue=""
                        {...register(`text-${activeStep}`)}
                    />
                </>
            );
        default:
            return (
                <>Ошибка при обработки данных!!!</>
            );
    }
}



export function MyStepper() {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [completed, setCompleted] = useState<{ [k: number]: boolean; }>({});
    const methods = useForm<formInput>();
    const {
        register,
        formState:{
            errors
        },
        control,
        handleSubmit,

        trigger}
        = methods
    console.log(methods)

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
        let isValid = false;
        console.log("F1", methods.getValues());
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

    // const switchInputCallback = useCallback((steps: questionSteps[]): ReactNode => {
    //     return switchInput(steps[activeStep].type, steps[activeStep].variants, activeStep);
    // }, [activeStep]);

    const onSubmit = (data: formInput) => console.log(data)

    // @ts-ignore
    return (
        <FormProvider {...methods} >
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(({name: label}, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
                <form onSubmit={handleSubmit(onSubmit)}>
                        {allStepsCompleted() ? (
                            <>
                                <Typography sx={{mt: 2, mb: 1}}>
                                    Тест пройден. Ожидайте результатов.
                                </Typography>
                                <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                                    <Button onClick={handleReset}>Reset</Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                {(totalSteps() > 0 &&
                                    (
                                        <SwitchInput
                                            type={steps[activeStep].type}
                                            variants={steps[activeStep].variants}
                                            activeStep={activeStep}/>
                                    )
                                )}
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

                </form>

</Box>
        </FormProvider>

)
    ;
}