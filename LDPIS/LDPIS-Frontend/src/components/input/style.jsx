import styled from "@emotion/styled";
import { OutlinedInput, Autocomplete, RadioGroup, InputLabel } from "@mui/material";
import Input from '@mui/material/Input';

export const InputLabelField = styled(InputLabel)(({ theme }) => ({
    top: "-7px",
    "&.Mui-focused, &.MuiInputLabel-shrink": {
        top: 0,
    },
}));

export const OutlinedInputField = styled(OutlinedInput)(({ theme }) => ({
    "&.Mui-focused": {
        borderColor: "transparent",
    },
    "& svg": {
        color: theme?.palette.primary.main
    },
    "&:hover": {
        borderColor: "transparent",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme?.palette.primary.main
        }
    },
}));

export const InputField = styled(Input)(({ theme }) => ({
    width: '100%',
    "&.Mui-focused": {
        borderColor: "transparent",
    },
    "&.MuiInput-underline": {
        color: theme?.palette.primary.main,
        "&:after": {
            borderBottom: `1px solid ${theme?.palette.primary.main}`
        },
        "&:after, :hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: `1.5px solid ${theme?.palette.primary.main}`
        }
    },
    "&:hover": {
        borderColor: "transparent",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme?.palette.primary.main
        }
    },
}));

export const SelectField = styled(Autocomplete)(({ theme }) => ({
    width: '100%',
    "&.Mui-focused": {
        borderColor: "transparent",
    },
    "&.MuiInput-underline": {
        color: theme?.palette.primary.main,
        "&:after": {
            borderBottom: `1px solid ${theme?.palette.primary.main}`
        },
        "&:after, :hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: `1.5px solid ${theme?.palette.primary.main}`
        }
    },
    "&:hover": {
        borderColor: "transparent",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme?.palette.primary.main
        }
    },
}));


export const RadioField = styled(RadioGroup)(({ theme }) => ({
    width: '100%',
    "&.Mui-focused": {
        borderColor: "transparent",
    },
    "&.MuiInput-underline": {
        color: theme?.palette.primary.main,
        "&:after": {
            borderBottom: `1px solid ${theme?.palette.primary.main}`
        },
        "&:after, :hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: `1.5px solid ${theme?.palette.primary.main}`
        }
    },
    "&:hover": {
        borderColor: "transparent",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme?.palette.primary.main
        }
    },
}));