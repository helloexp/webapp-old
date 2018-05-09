In order to use mixins provided to you by the _spacing.scss you will first need to import it. 
The main base theme already does, and you want to build on top of that instead. 

The provided mixins that you can use for spacing are as follows:

@include spacing(<size>, <type>)

type is one of two: 'v' for vertical spacing and 'h' for horizontal spacing
size is one of the following: 'xxs', 'xs', 's', 'm', 'l', 'xl' for tiny, extra small, small, medium, large and extra large respectively 

Some examples:

.example {
  @include spacing('l', 'v'); //large vertical spacing
  @include spacing('m', 'h'); //medium horizontal spacing
  
  ... some other styles
}


Generate a media query based on conditions [Array] - replace {Breakpoint} with 'smallDevice' or 'mediumDevice' etc, or you can define your own

@include media('>{Breakpoint}') - single bp
@include media('>{Breakpoint1}', '<={Breakpoint2}') - two bps
@include media('>={Breakpoint}', '<=450px') - custom values for two bps - tweakpoint
@include media('{Breakpoint}', '<=460px') - custom values and set bp
@include media('handheld') - static expression as defined in $media-expressions
@include media('>=350px', '<{Breakpoint}', 'retina3x') - all of em combined minus tweakpoint


 Defining $tweakpoints, custom map will be merged with $bps
 Defining $tweak-media-expressions, custom map will be merged with $media-expressions
 Redefine configurations just for the scope of the call

 @include media-context(('custom': 678px)) {
   .example {
     @include media('>{Breakpoint}', '<=custom') {
       // ...
     }
 }

 @include media-context($tweak-media-expressions: ('all': 'all')) {
   .example {
     @include media('all', '>{Breakpoint}') {
       // ...
     }
 }

 The two can be combined, extending both the list of expressions and breakpoints
 
 Optionally, you can define your own @include media 
 
 Here's how the medium horizontal spacing is defined - should give you a really strong feel for how to use it
 
.mediumHzSpacing {
  @include media('<=smallDevice') {
    margin-left: 12.8px;
    margin-right: 12.8px;
  }
  @include media('>smallDevice', '<=largeDevice') {
    margin-left: 15px;
    margin-right: 15px;
  }
  @include media('>largeDevice') {
    margin-left: 16.56px;
    margin-right: 16.56px;
  }
}

For font-sizes you should look through the headings.scss file. It is also imported by the main base theme.
All font-sizes are based upon the Japanese Font Ramp

Usage is as follows: 

.example { 
  @extend %baseA;
  ... more styles
}

.example {
  @extend %baseBPlus2;
  ... more styles
}
