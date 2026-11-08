<!-- Source: https://m3.material.io/foundations/interaction/gestures · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__interaction__gestures.md @ 3c0e291 -->

# Gestures

Gestures are all the ways people interact with UI elements using touch

- Gestures help people navigate, take action, or transform content
- UI elements should respond to gestures in real time
- Tap, scroll, and swipe are common gestures

## Resources

| Type | Link | Status |
|---|---|---|
| Design | [Design Kit (Figma)](http://goo.gle/m3-design-kit) | Available |

## Types of gestures

### Tap

People can navigate to destinations and interact with elements through touch.

*[video: Mobile UI shows a tap on the 1st of 3 news cards. The card opens to show the full article.]*
Tapping a card opens an article

### Double tap

Two quick taps allows people to zoom in and out of content.

*[video: Mobile UI shows a double tap on a floral photo. The image expands to fill the screen.]*
Double tapping on a photo opens it to full screen

### Long press

People can access additional functionality by pressing on elements for an extended time.

*[video: A long press on an email reveals a selection checkmark and a container color change.]*
Long pressing a list item selects it

### Scroll and pan

People can slide surfaces vertically, horizontally, or in any direction to move through content.

*[video: Scrolling a feed.Scrolling up and down in a photo feed.]*
Vertical scrolling reveals more content

### Swipe

People can navigate horizontally to:

- Switch between peer views like tabs
- Complete actions

*[video: A swipe right on an email reveals a favorites icon.]*
Swiping a list item can reveal additional actions

### Predictive back

On Android, a person can swipe left or right on certain components as a way to navigate to a previous destination. This gesture is called [predictive back](https://github.com/material-components/material-components-android/blob/master/docs/foundations/PredictiveBack.md).

Before completing the swipe, the person can decide to continue to the previous view or stay in the current view.

Compatible components are:

- Bottom sheet
- Navigation bar
- Navigation rail
- Search bar
- Side sheet

*[video: Back swipe on a bottom sheet takes s person back to the previous screen of a photo feed.]*
A predictive back swipe on a bottom sheet goes back to the previous screen

### Drag

People can move elements around and slide surfaces in and out of view.

*[video: A person drags the second email in a mobile inbox to the third position and back to the second position.]*
A list can be reordered by dragging a list item

### Pick up and move

A long press and drag allows people to reorder content.

*[video: Picking up and moving a calendar event to a new time.]*
A calendar event can be picked up and moved to a new time

### Pinch

People can scale surfaces to navigate between screens.

*[video: Dragging two points apart opens photo to full screen, dragging them towards each other collapses the photo.]*
A photo can be pinched outward to a full screen view

### Compound gestures

Users can fluidly transition between various gestures, like panning and pinching in a map view.

*[video: Pan gesture moves map, then pinch gesture is used to zoom out then in.]*
A map UI can be navigated through a combination of pan and pinch
