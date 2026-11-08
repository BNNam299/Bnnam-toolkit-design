<!-- Source: https://m3.material.io/foundations/interaction/inputs · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__interaction__inputs.md @ 3c0e291 -->

# Inputs

Inputs are devices that provide interactive control of an app. Common inputs include a mouse, keyboard, or touchpad.

- Design for touch, keyboard, and mouse interactions
- Embrace multiple input methods and gestures within your app

*[image: Editing interface on a large screen device. The selected text is highlighted and the text cursor is visible.]*
Designing for inputs allows people to use the inputs they prefer, like a mouse to highlight text on a tablet

## External inputs for devices

People can use external inputs like a mouse, keyboard, or stylus with their phone, tablet, foldable, TV, laptop, or desktop computer. When someone connects an external input to their device, they expect it to behave in familiar and useful ways. Designing for different input methods can make a product more usable and accessible on all screen sizes.

### Common features of external inputs

#### **Mouse**

- Left and right click
- Mouse wheel
- Extra buttons

#### **Trackpad**

- Left and right click
- Gestures
- Haptics

#### **Physical keyboard**

- Replaces virtual keyboard
- Media keys
- Modifier keys

*[image: Image of a mouse.]*

*[image: Image of a laptop keyboard and trackpad.]*

*[image: Image of a keyboard.]*

### Input device behaviors

Depending on the input device, designers and developers can implement behaviors that meet standard conventions and user expectations.

| Input device action | Anticipated behavior |
|---|---|
| Mouse and trackpad movement | Show a mouse cursor on the screen |
| Primary click | Treat mouse clicks differently than touch events |
| Secondary click | Activate context menus |
| Hover | Change component states |
| Highlight | Allow text to be selected by the mouse cursor |
| Mouse wheel and trackpad two finger drag | Scroll list vertically and horizontally |
| Trackpad pinch | Zoom an element or page |
| Physical keyboard | Hide and show on screen keyboard |

## Mouse and cursor interactions

When an external mouse input device is used, a mouse cursor should be shown, regardless of the device type. <br><br>A mouse may be connected to tablets, laptops, phones, foldables, and more. On some devices, it's possible to use an external input device simultaneously with touch input. <br><br>On devices that don't specifically recognize mouse or stylus input, the mouse is treated as touch input.

### Primary click

A mouse click or stylus tap should demonstrate the same feedback as touch input. One example of this is showing the ripple for a pressed state.

*[image: A view of a display with a visible mouse cursor.]*
A visible mouse cursor is seen when the external input is connected

### Secondary click

#### Context menus

A secondary click (whether using a single button or two fingers on a trackpad) should activate a context menu. The context menu shows additional options for the object that's clicked. See [menus](https://m3.material.io/components/menus) for more usage and guidelines.

*[image: A context menu pop up from a link with the options: Open link in new window, Save link as, Copy link location, and Inspect.]*
The context menu should appear when right clicking with a mouse or trackpad

### Hover

When using a mouse cursor, help users discover interactive objects by enabling visual changes. When the mouse rests on an interactive element, the hover state is a valuable cue for interaction. See [states](https://m3.material.io/m3/pages/interaction-states/applying-states#71c347c2-dd75-485b-892e-04d2900bd844) for styles and guidelines.<br><br>Hovering with a cursor (or stylus) should also invoke tooltips when applicable. See [tooltips](https://m3.material.io/components/tooltips) for guidance.

*[image: Icon button, floating action button, and menu items in their hovered and not hovered states.]*
1. Components without a hover state
2. Components with a hover state change applied

### Cursors

Cursors appear when using external input devices like a mouse or trackpad. The cursor can change to communicate more information about interactive elements.

#### Pointer

By default, external input control should be rendered as a pointer.

*[image: A cursor rendered as a pointer.]*
1. A pointer provides a visible indicator for input controls

#### Hand

The cursor should appear as a hand to indicate links or linked images.

*[image: A link cursor (hand) shown when hovering over a linked image.]*
1. The hand cursor is used for links and clickable images

#### Resize arrows

The cursor should change to resize arrows on the boundaries of resizable elements.

*[image: A cursor at the edge of the screen as resize arrows.]*
1. Resize arrows indicate an element can be resized

#### I-beam

The cursor should appear as an I-beam when hovering on text. When manipulating editable text, the following interactions apply:

- Single click places the cursor
- Double click selects a word
- Triple click selects a paragraph
- Single click deselects text and repositions the cursor

*[image: I-beam cursor hovering over selectable text.]*
1. An I-beam cursor indicates selectable text

### Text selection

When selecting text using a mouse, trackpad, or stylus:

- Highlight the selected area using a single color
- Don’t show touch controls next to the highlighted area

*[image: Highlighted text in a single color.]*
1. Selected text shows a visible highlight

### Text selection with touch control

When interacting using touch, always show touch controls, even if other inputs are connected.<br><br>When using a mouse, trackpad, or stylus, show the I-beam and context menu, even if it's a touch device.

*[image: Touch controls are produced on selected text, with mouse and trackpad detected.]*
When using a touchscreen to select text, show touch controls

*[image: Selected text with a context menu, with mouse and trackpad detected.]*
When using a mouse, trackpad, or stylus to select text, use the right-click context menu

### Stylus input

When using a stylus, cursors are usually not necessary, unless they communicate tool properties such as brush size or shape.

*[image: A cursor rendered as a circle.]*
1. The circle cursor indicates the selected stylus tool and size

## Mouse wheel and trackpad gestures

When an external mouse or touchpad is used, the mouse wheel and trackpad gesture allow more actions.

### Vertical scroll

When a cursor is positioned on a list, the mouse wheel and two-finger touchpad gesture should allow vertical scrolling of the list.

*[video: Stationary cursor over a scrolling field controlled by a mouse wheel or trackpad.]*
Scrolling a vertical list using the mouse wheel or trackpad gestures. Note that only the detail panel under the cursor scrolls.

### Touch scroll & mouse text selection

Upon touch and drag gesture, the text area will scroll. With a mouse interaction, dragging in a text area will select the text.

*[video: Animation of a swipe gesture to scroll the screen.]*
On a touch screen, dragging upward scrolls the field down

*[video: Animation showing a dragging gesture with a mouse to select text and image.]*
When using a mouse, dragging upward selects text and images

### Horizontal scroll

Mouse users should be able to scroll with a mouse wheel to navigate horizontally scrolling fields. Trackpad users should be able to scroll using a two-finger horizontal gesture.

*[video: A news feed of horizontally scrolling cards.]*
Carousels can scroll horizontally using a scroll wheel or trackpad

## Physical keyboard

When a physical keyboard is connected to a device, either externally or as a built-in laptop keyboard, users should be able to perform any actions that the virtual keyboard provides, and more.

### Show and hide virtual keyboard

A virtual keyboard should appear or hide in response to the presence of a physical keyboard.

*[image: Text being entered into a field with no on-screen keyboard displayed.]* **✅ Do**
When a physical keyboard is attached, hide the virtual keyboard

*[image: Text being entered into a field with an on-screen keyboard.]* **✅ Do**
When a physical keyboard is removed, show the virtual keyboard

### Common keyboard interactions

#### Enter key

People typically expect the **E****nter** key on a physical keyboard to be enabled by developers to allow a common function like sending a message.

*[video: A message being typed into a chat, and sent using the Enter key.]*
The**Enter**key typically triggers actions like sending a message

#### Spacebar control

People typically expect the **Spacebar** (or available media keys) to be enabled to play and pause music or video.

*[video: A video being paused and resumed by pressing the Spacebar.]*
Pressing **Space** usually pauses and plays media

#### Tab focus

When keyboard users navigate a page using **Tab**, the focus on interactive items must follow a logical order. On most pages, that means left to right, top to bottom.<br><br>When focused from a keyboard or other input device, the focus state includes a ring-like keyboard focus indicator.

*[image: Tab focus is on “small,” which is one of four size options for sweatshirts at an online store.]*
Tab focus includes a visible keyboard focus indicator

*[image: Tab focus is on “medium,” which is one of four size options for sweatshirts at an online store.]*
The focus state moves elements as the user presses **Tab** on their keyboard

#### Escape key

People typically expect the **Escape** key on a physical keyboard to dismiss elements, remove focus, or clear selections.

*[video: Escape key dismisses menu.]*
The **Escape** key should dismiss any visible modal elements like menus, dialogs, or bottom sheets

*[video: Escape key removes focus indicator from icon.]*
The **Escape** key should remove any visible focus indicators and set the focus order to 0

*[video: Escape key dismisses text cursor and leaves text itself unchanged.]*
The **Escape** key should remove the text cursor when typing, but should not remove already-typed text
