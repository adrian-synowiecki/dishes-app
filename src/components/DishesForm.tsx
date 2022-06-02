import { FC, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  Alert,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";

import axiosInstance from "../api/axios-instance";
import styles from "./DishesForm.module.scss";

interface DishesFormTypes {
  name: string;
  dish_type: string;
  no_of_slices: number;
  diameter: string;
  spiciness_scale: number;
  slices_of_bread: number;
}

const DishesForm: FC = () => {
  const [serviceUnavailableError, setServiceUnavailableError] = useState("");
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  const [datePickerValue, setDatePickerValue] = useState<Date | null>(null);
  const [preparation_time, setPreparation_time] = useState<string | null>(null);

  const { control, handleSubmit, setValue, formState, reset } =
    useForm<DishesFormTypes>({
      mode: "onChange",
      defaultValues: {
        name: "",
        dish_type: "",
        no_of_slices: 1,
        diameter: "",
        spiciness_scale: 1,
        slices_of_bread: 1,
      },
    });

  useEffect(() => {
    const testData = {
      name: "Test",
      preparation_time: "02:10:23",
      slices_of_bread: 2,
      type: "sandwich",
    };

    const checkServiceAvailability = async () => {
      try {
        await axiosInstance.post(`dishes`, testData);
      } catch (err) {
        const error = err as { response: { status: number } };
        if (
          error.response.status === 401 ||
          error.response.status === 400 ||
          error.response.status === 500
        ) {
          setServiceUnavailableError(
            "Our services are not available at the moment, please try again later"
          );
        }
      }
    };

    checkServiceAvailability();
  }, []);

  const dish_type = useWatch({
    control,
    name: "dish_type",
  });

  const diameter = useWatch({
    control,
    name: "diameter",
  });

  const onSubmit: SubmitHandler<DishesFormTypes> = async (data) => {
    let dishDetails;

    if (dish_type === "pizza") {
      dishDetails = {
        name: data.name,
        preparation_time,
        type: data.dish_type,
        no_of_slices: Number(data.no_of_slices),
        diameter: Number(data.diameter),
      };
    }

    if (dish_type === "soup") {
      dishDetails = {
        name: data.name,
        preparation_time,
        type: data.dish_type,
        spiciness_scale: Number(data.spiciness_scale),
      };
    }

    if (dish_type === "sandwich") {
      dishDetails = {
        name: data.name,
        preparation_time,
        type: data.dish_type,
        slices_of_bread: Number(data.slices_of_bread),
      };
    }
    // form is handling wrong data errors before they can reach the server
    await axiosInstance.post("dishes", dishDetails);
    setIsOpenSnackbar(true);
    reset();
    setDatePickerValue(null);
  };

  const handleTimePickerChange = (new_preparation_time: Date | null) => {
    setDatePickerValue(new_preparation_time);
    const extracted_preparation_time =
      String(new_preparation_time).split(" ")[4];
    setPreparation_time(extracted_preparation_time);
  };

  const handleDiameterFormatChange = (diameter: string) => {
    setValue("diameter", Number(diameter).toFixed(2));
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpenSnackbar(false);
  };

  return (
    <>
      <form className={styles.dishesForm} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              required
              label="Dish name"
              variant="outlined"
              {...field}
            />
          )}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            ampm={false}
            openTo="hours"
            views={["hours", "minutes", "seconds"]}
            inputFormat="HH:mm:ss"
            mask="__:__:__"
            label="Preparation time"
            value={datePickerValue}
            onChange={handleTimePickerChange}
            renderInput={(params) => <TextField required {...params} />}
          />
        </LocalizationProvider>

        <FormControl fullWidth variant="filled">
          <InputLabel id="dish_typeId-label">Choose dish</InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                required
                {...field}
                labelId="dish_typeId-label"
                id="dish_typeId"
              >
                <MenuItem value="pizza">Pizza</MenuItem>
                <MenuItem value="soup">Soup</MenuItem>
                <MenuItem value="sandwich">Sandwich</MenuItem>
              </Select>
            )}
            name="dish_type"
            control={control}
            defaultValue=""
          />
        </FormControl>

        {dish_type === "pizza" && (
          <>
            <Controller
              name="no_of_slices"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  id="no_of_slices"
                  label="The number of pizza slices"
                  type="number"
                  {...field}
                  InputProps={{
                    inputProps: {
                      min: 1,
                    },
                  }}
                />
              )}
            />
            <Controller
              name="diameter"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  id="diameter"
                  label="Pizza size"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">cm</InputAdornment>
                    ),
                    inputProps: {
                      min: 15,
                      step: 1,
                    },
                  }}
                  {...field}
                  onChange={(event) =>
                    handleDiameterFormatChange(event.target.value)
                  }
                  value={diameter}
                />
              )}
            />
          </>
        )}

        {dish_type === "soup" && (
          <Controller
            name="spiciness_scale"
            control={control}
            render={({ field }) => (
              <TextField
                required
                id="spiciness_scale"
                type="number"
                label="Spiciness scale (1-10)"
                {...field}
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: 10,
                  },
                }}
              />
            )}
          />
        )}

        {dish_type === "sandwich" && (
          <Controller
            name="slices_of_bread"
            control={control}
            render={({ field }) => (
              <TextField
                required
                type="number"
                defaultValue=""
                id="slices_of_bread"
                label="Slices of bread"
                InputProps={{
                  inputProps: {
                    min: 1,
                  },
                }}
                {...field}
              />
            )}
          />
        )}

        {serviceUnavailableError && (
          <Alert severity="error">{serviceUnavailableError}</Alert>
        )}

        {formState.isSubmitting ? (
          <LoadingButton
            sx={{
              height: 40,
            }}
            loading
            variant="contained"
          >
            Save
          </LoadingButton>
        ) : (
          <Button
            sx={{
              height: 40,
            }}
            type="submit"
            variant="contained"
          >
            Save
          </Button>
        )}
      </form>

      {formState.isSubmitSuccessful && (
        <Snackbar
          open={isOpenSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            Recipe has been successfully saved!
          </MuiAlert>
        </Snackbar>
      )}
    </>
  );
};

export default DishesForm;
