# react-native-modal-manager

[![Stable Release](https://img.shields.io/npm/v/react-native-modal-manager.svg)](https://www.npmjs.com/package/react-native-modal-manager)
[![license](https://img.shields.io/npm/l/react-native-modal-manager)](./license.txt)

Simple opening and closing modals in react-native with no dependencies

**Warning: project at beta-testing stage**

## Purposes

 - Simple opening and closing modals (no boilerplate code)
 - Separate modal state management logic from components, that use modals
 - Easily open the same modal from different components
 - Use some default props for all modals
 - Compatible with [react-native](https://reactnative.dev/docs/modal) modals and [react-native-modal](https://github.com/react-native-community/react-native-modal) animated modals.
 
## Install
`npm i react-native-modal-manager`

## Example
MyModal.js
```js
import * as React from 'react';
import modalManager from "react-native-modal-manager";
import { Modal, Text, Button } from "react-native";

const MyModal = ({ name, message, ...props }) => <Modal>  
  <Text>{message}</Text>
  <Button
    title="Close"
    onPress={() => modalManager.close(name)}
  />
</Modal>

export const myModalName = "MyModal";
modalManager.push(myModalName, MyModal);
```
MyButton.js
```js
import * as React from 'react';
import { Button } from "react-native";
import modalManager from "react-native-modal-manager";
import { myModalName } from "./MyModal.js";

const MyButton = () => <Button
  title="Open modal"
  onPress={() => modalManager.open(
    myModalName,
    {
      message: "Hello world!"
    }
  )}
/>
```
App.js
```js
import * as React from 'react';
import { View } from "react-native";
import { ModalContainer } from "react-native-modal-manager";
import MyButton from "./MyButton";

const App = () => <View>
  <MyButton />
  <ModalContainer />
</View>
```

## Usage
### With [react-native-modal](https://github.com/react-native-community/react-native-modal)
Add to your `index.js`

*(Warning: if this option is enabled - modalManager will be incompatible with react-native modals)*
```js
modalManager.setup({
  reactNativeModalCompatibleMode: true
});
```
### Set default props for all modals
```js
modalManager.setup({
  props: {
    // Your default props for all modals
  }
});
```
### Debug
If strict mode enabled - some useful warnings will be shown.

For example: calling `close` method of `ModalManager` with `name`, that differs from currently running modal's `name` will produce warning.
```js
modalManager.setup({
  strict: true
});
```

## API

### `ModalManager`
`setup(options object)` - change options of ModalManager. Can be called at any time.

`push(name string, modal function | class)` - register given component as *modal* with a *name*, which can be used in future for opening or closing this modal. Name must be unique in application scope. 

`open(name string, props object)` - open modal, associated with given *name*. Given *props* will be passed to opened modal.

`close(name string)` - close modal, associated with given *name*.

`getOption(option string)` - return current ModalManager *option* value.

## PR
Pull requests, feedbacks and suggestions are welcome!

## License
MIT
