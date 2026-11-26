# Story 21: Consistent Pose Card Layout

**Status:** in progress

## Goal

Align images, dividers, and labels across cards in the Pose Library and practice-log pose picker.

## Background Knowledge

The shared PoseCard currently lets long labels consume image space. A consistent label region and a shrinkable image region can stabilize the layout. object-contain preserves each image's proportions, so source-image padding can still affect the visible illustration size.

## Acceptance Criteria

- [x] Reserve equal label height and display up to two lines.
- [ ] Verify access to full truncated names on touch devices. A title attribute is provided for desktop hover.
- [x] Keep image regions and dividers aligned for short and long names and missing images.
- [ ] Review remaining artwork-size and clipping differences in source images.
- [ ] Verify the library and create/edit pose picker at mobile and desktop widths, including long names and unusually tall images.
- [x] Review the proposed code before implementation.

## Scope

Update the shared PoseCard layout. Assess source-image padding separately if differences remain after layout alignment.

## Validation

The user reviewed desktop screenshots of the picker and library and confirmed improved label layout. Artwork sizing differences remain. Mobile validation is pending.
