import React, { useState, MouseEvent } from 'react'
import { ISettingsProps } from '../lib/interfaces'
import { Modal, Button, Row, Col, Form, FormGroup, Container } from 'react-bootstrap'
import { customParseInt, InputFormEvent } from '../lib/util'

export const Settings: React.FC<ISettingsProps> = ({ handleSettingsSubmit }) => {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const [mineCount, setMineCount] = useState(0)
  const [customSettings, setCustomSettings] = useState(false)
  const [gameDifficulty, setGameDifficulty] = useState<string | null>(null)
  const [validationModal, setValidationModal] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const settings = [
    { value: "beginner", text: "Beginner (8x8, 10 mines)" },
    { value: "intermediate", text: "Intermediate (16x16, 40 mines)" },
    { value: "expert", text: "Expert (16x30, 99 mines)" },
    { value: "custom", text: "Custom Game" }
  ]

  const onSubmit = (): void => {
    const errors:string[] = []

    if(!gameDifficulty) {
      
      errors.push("Please select a difficulty before playing.")
    } else {
      if(height < 8 || height > 30) {
        errors.push("Height must be between 8 and 30.")
      }
      
      if(width < 8 || width > 30) {
        errors.push("Width must be between 8 and 30.")
      }
      
      if(mineCount > height * width - 10) {
        errors.push("You must leave at least 10 cells open (mine free).")
      } else if (mineCount === 0) {
        errors.push("You must have at least one mine to play the game.")
      }
    }
      
    if(errors.length) {
      setValidationModal(true)
      setErrors(errors)
    } else {
      handleSettingsSubmit(height, width, mineCount)
    }
  }

  const handleValidationClose = () => setValidationModal(false)

  const handleSettingsChange = (e: MouseEvent<HTMLInputElement>): void => {
    setGameDifficulty(e.currentTarget.id)
    setCustomSettings(e.currentTarget.id === "custom")
    
    switch(e.currentTarget.id) {
      case "beginner":
        setHeight(8)
        setWidth(8)
        setMineCount(10)
        break

      case "intermediate":
        setHeight(16)
        setWidth(16)
        setMineCount(40)
        break

      case "expert":
        setHeight(16)
        setWidth(30)
        setMineCount(99)
        break

      case "custom":
      default:
        if(!height) {
          setHeight(16)
        }

        if(!width) {
          setWidth(30)
        }

        if(!mineCount) {
          setMineCount(99)
        }
        break
    }
  }

  return (
    <Col sm={{ span: 6, offset: 3 }}>
      <Container>
        <Row>
          <Col>
            <h1>Settings</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <ul className="settings">
              {settings.map(setting =>{
                return <li key={setting.value}>
                  <label className="radio-label">
                    {setting.text}
                    <input type="radio" name="settings" id={setting.value} onClick={handleSettingsChange} />
                    <span className="radio-button"></span>
                  </label>
                </li>
              })}
            </ul>
          </Col>
        </Row>
        {customSettings ? (
          <>
            <Row><Col>
              <FormGroup>
                <Form.Label>Height:
                  <Form.Control placeholder="Enter height" value={height.toString()} onChange={(e: InputFormEvent): void => {
                    setHeight(customParseInt(e.currentTarget.value))
                  }}/>
                </Form.Label>
              </FormGroup>
            </Col></Row>
            <Row><Col>
              <FormGroup>
                <Form.Label>Width:
                  <Form.Control placeholder="Enter width" value={width.toString()} onChange={(e: InputFormEvent): void => {
                    setWidth(customParseInt(e.currentTarget.value))
                  }}/>
                </Form.Label>
              </FormGroup>
            </Col></Row>
            <Row><Col>
              <FormGroup>
                <Form.Label>Number of mines:
                  <Form.Control placeholder="Number of mines" value={mineCount.toString()} onChange={(e: InputFormEvent): void => {
                    setMineCount(customParseInt(e.currentTarget.value))
                  }}/>
                </Form.Label>
              </FormGroup>
            </Col></Row>
          </>
        ) : (
          ""
        )}
        <Row><Col>
          <Button onClick={onSubmit}>Save Settings</Button>
        </Col></Row>
        <Modal show={validationModal} onHide={handleValidationClose}>
          <Modal.Header>Mine sweeper</Modal.Header>
          <Modal.Body>
            The following errors need to be resolved before you can create a game:
            <ul className="errors">
              {errors.map(error => {
                return <li>{error}</li>
              })}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleValidationClose}>Ok</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Col>
  )
}