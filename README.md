# Alexa

This node.js script is responsible for all the alexa operations and validating the child's answers.

It consists of 4 main parts:
  
  1. Alexa Intents mapping what the child says to corresponding functions to handle what he said.
  2. Dialog model for a smooth conversation between the child and Alexa
  3. Publishing to an MQTT topic for communication from alexa to the cubes. Usually done to give the cubes a signal to update the state of the shadow object with the current face value.
  4. Retreving the state of the shadow object from AWS IoT to get the face value that the cube has landed on and check it with the child's       answer
