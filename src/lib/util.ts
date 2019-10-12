import { FormEvent } from "react"
import { ReplaceProps, BsPrefixProps } from "react-bootstrap/helpers"
import { FormControlProps } from "react-bootstrap"

export const customParseInt = (value: string | undefined): number => {
  let int = parseInt(value ? value : "")
  return isNaN(int) ? 0 : int
}

export type InputFormEvent = FormEvent<ReplaceProps<"input", BsPrefixProps<"input"> & FormControlProps>>