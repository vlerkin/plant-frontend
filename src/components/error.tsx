interface ErrorProps {
  message: string | undefined;
}

const ErrorMessage = (props: ErrorProps) => {
  if (props.message) {
    return <p className="error-msg">! {props.message}</p>;
  } else {
    return <p className="error-msg">! Something went wrong </p>;
  }
};

export default ErrorMessage;
