import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup, Radio,
    RadioGroup,
    Step,
    StepLabel,
    Stepper, TextField,
    Typography
} from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import {FormProvider, useForm, useFormContext} from "react-hook-form";
import {localStorageClear, localStorageGet, localStorageSet} from "../../../../helpers/localStorage";

enum typeAnswer {
    checkbox = "checkbox",
    radio = "radio",
    text = "text"
}

interface questionSteps {
    name: string,
    type: typeAnswer,
    variants: Array<string>
}

interface IStepperProps {
    isTimeOut: boolean
}

type switchInputProps = {
    type: string,
    variants: questionSteps["variants"],
    activeStep: number
}

type formInput = {
    [key: string]: string | Array<string> | null,
}

function SwitchInput({type, variants, activeStep}: switchInputProps) {
    const {register} = useFormContext();

    switch (type) {
        case typeAnswer.checkbox:
            return (
                <FormGroup sx={{alignContent: "center"}}>
                    {variants.map((variant, index): ReactNode => (
                        <FormControlLabel
                            value={variant}
                            control={<Checkbox key={index} {...register(`check-${activeStep}`)} />}
                            label={variant}/>
                    ))}
                </FormGroup>
            )

        case typeAnswer.radio:
            return (
                <RadioGroup name="radio-buttons" sx={{alignContent: "center"}}>
                    {variants.map((variant, index): ReactNode => (
                        <FormControlLabel
                            value={variant}
                            key={index}
                            control={<Radio {...register(`radio-${activeStep}`)} />}
                            label={variant}/>
                    ))}
                </RadioGroup>
            );
        case typeAnswer.text:
            return (
                <>
                    <TextField
                        id={activeStep.toString()}
                        label="Введите ответ..."
                        multiline
                        rows={4}
                        defaultValue=""
                        fullWidth
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


export function MyStepper({isTimeOut}: IStepperProps) {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [completed, setCompleted] = useState<{ [k: number]: boolean; }>({});
    const methods = useForm<formInput>();

    const steps: questionSteps[] = [
        {
            name: 'Как правильно мы называем файл который создаем самым первым?', type: typeAnswer.radio,
            variants: ["index.html", "JavaScript.js", "style.css"]
        },
        {
            name: 'Выберите неправильный ответ.', type: typeAnswer.checkbox,
            variants: ["строчный тэг как и блочный неможет размещать ряом другие тэги",
                "строчным тэгам можно дать ширину и высоту",
                "фотография обладает строчно-блочным свойством"]
        },
        {
            name: 'Какое свойство отвечает за превращения из блочного тэга в строчный?',
            type: typeAnswer.text,
            variants: []
        }
    ];

    const {
        handleSubmit
    }
        = methods

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

    const handleComplete = () => {
        if (!isLastStep()) {
            localStorageSet("form", methods.getValues());
        } else {
            localStorageClear("form");
        }
        setCompleted({
            ...completed,
            [activeStep]: true,
        });
        handleNext();
    };

    useEffect(() => {
        if (localStorageGet("form")) {
            const form = localStorageGet("form");
            if (form) {
                Object.keys(JSON.parse(form)).map((el) => {
                        if (methods.getFieldState(el)) {
                            methods.setValue(el, JSON.parse(form)[el])
                            handleComplete()
                        }
                    }
                );
            }

            return;
        }
    }, [])

    const onSubmit = (data: formInput) => console.log(data)

    return (
        <FormProvider {...methods} >
            <Box sx={{width: '100%'}}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{mb: 3}}>
                    {steps.map(({name: label}, index) => (
                        <Step key={label} completed={completed[index]}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{justifyContent: "center", textAlign: "center"}}>
                        {allStepsCompleted() ? (
                            <>
                                <Typography sx={{mt: 2, mb: 1}} textAlign="center">
                                    Тест пройден. Ожидайте результатов.
                                </Typography>
                            </>
                        ) : (

                            totalSteps() > 0 && !isTimeOut && (
                                <SwitchInput
                                    type={steps[activeStep].type}
                                    variants={steps[activeStep].variants}
                                    activeStep={activeStep}
                                />
                            )
                        )}

                        <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                            {activeStep !== steps.length && (
                                completed[activeStep] && isLastStep() ? (
                                    <Box>
                                        <Typography variant="h5" sx={{display: 'inline-block'}}>
                                            Ваши ответы:
                                        </Typography>
                                        <>
                                            {Object.keys(methods.getValues()).map((el, index) => (
                                                <Box component="div" key={el} pb={2}>
                                                    {steps[index].name + " : " + (typeof methods.getValues()[el] !== "string" ? "Ответ не дан" : methods.getValues()[el])}
                                                </Box>
                                            ))}
                                        </>
                                    </Box>
                                ) : isTimeOut ? (
                                    <>
                                        <Typography sx={{mt: 2, mb: 1}} textAlign="center">
                                            Тест не пройден
                                        </Typography>
                                    </>
                                ) : (
                                    completedSteps() !== totalSteps() && (
                                        <Button onClick={handleComplete}>
                                            Ответить
                                        </Button>
                                    )
                                )
                            )}
                        </Box>
                    </div>


                </form>

            </Box>
        </FormProvider>

    )
        ;
}