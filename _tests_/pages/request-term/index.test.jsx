
import { render, screen, fireEvent } from "@testing-library/react";

import RequestTerm from "../../../src/pages/request-term/index";


jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key })
}))

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: () => { },
    register: () => { },
    formState: {
      errors: (errors) => errors,
      isSubmit: (isSubmittting) => isSubmittting
    }
  })
}));

jest.mock('react-google-recaptcha', () => ({
  __esModule: true,
  default: ({ props }) => <div>{props}</div>,
  ReCAPTCHA: ({ props }) => <div>{props}</div>,
}))

describe("RequestTerm", () => {
 
  it("should render the RequestTerm page properly", () => {
    render(<RequestTerm />)
    expect(screen.getByRole("heading")).toBeInTheDocument();
  })

  it('should submit form with all valid values', () => {
    render(<RequestTerm/>)
   
  })
})