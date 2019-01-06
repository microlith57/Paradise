## Development Tutorials

These tutorials explain how to edit Paradise itself. They require a local copy of this repository, ideally as a fork.

Paths in this tutorial, unless otherwise stated, are relative to the `Paradise` folder.

### Creating an Action

[Actions](ACTIONS.md) are defined with individual JavaScript files, in `desktop/server/actions`. To create your own action, create a file with these contents:

```JavaScript
'use strict'

const Action = require(`../core/action`)
const errors = require('../core/errors')

function ActionName (host) {
  Action.call(this, host, 'actionnamelowercase')

  this.docs = 'Documentation'

  this.operate = function (action, params) {

  }
}

module.exports = ActionName
```

Name it with the same name as the command you want to create.

Then:

-   Replace `ActionName` with the name of your command
    -   There are two of these
-   Replace `actionnamelowercase` with the name of your command, but lowercase
-   Replace `Documentation` with a message to be provided by the `learn` action
-   Write the logic of your action in the `operate` function, with the output as a `return` statement.

Finally, test your action, and optionally add it to the walkthrough.

### Creating a Wildcard

Wildcards are defined as functions, and stored in groups. Each group is its own JavaScript file. This tutorial assumes you are adding a wildcard to a previously existing group.

Open the group's file under `desktop/server/wildcards`. There is an array called `_lib` - add a new entry at the end (before the `]`). Copy-paste this in:

```javascript
{
  props: ["WILDCARDNAME", ['argument1', 'argument2'], 'Documentation'],
  func: function (context, argument1, argument2) {
    // Do logic here
    return helpers.nil
  }
},
```

-   Replace `WILDCARDNAME` and `Documentation` with the name and documentation for your wildcard
-   Replace the list of arguments (`['argument1', 'argument2']`)  with the arguments for your wildcard
-   Replace the arguments of the function with the arguments of your function. **Make sure the first argument is `context`** - this is for information such as the vessel which called the function. It is not a part of the wildcard arguments and the WildcardLISP interpreter uses it internally.
-   Write your logic in the function, making sure to return a value that WildcardLISP can use (see the list of usable types).

Now, test your wildcard, and optionally add it to the Walkthrough.

### Creating a Wildcard Group

To create a wildcard group, make a duplicate of the `desktop/server/wildcards/_template.js` file. Name the file after the group you are creating.
Then, in `desktop/server/wildcards/index.js`, find the array called `_groups`, and add a new line, like so:

```javascript
'group_name': 'Group description, following convention',
```

Finally, fill in the `group_name` and `Group description...` fields.

### Adding a Walkthrough Section

To add a walkthrough section, you will need to edit the `desktop/sources/scripts/walkthrough.js` file. This file contains many sections. Add a new section, just above the line that says `this.all = []`, with the following content:

```javascript
this.SectionName = [
  '_RESET',
  'perform actions here',
]
```

You can have as many lines as you like. It is recommended the sequence starts with `_RESET`, as this special command resets the world.

Next, replace `SectionName` with the name of the section you want to add.

Finally, at the end of the block of `this.all = this.all.concat()` statements, add a new line (replacing `SectionName` with the same name as before):

```javascript
this.all = this.all.concat(this.SectionName)
```

## Notes

### Usable WildcardLISP types

-   Strings
-   Numbers
-   Functions (represented as Lambdas in WildcardLISP)
-   Arrays
-   `helpers.nil`
