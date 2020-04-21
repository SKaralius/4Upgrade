import React from "react";

const FormError = ({ error }) => {
	if (error) {
		return <span>{error.message}</span>;
	} else {
		return null;
	}
};

export default FormError;
