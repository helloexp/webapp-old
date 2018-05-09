// this is what the code does:
// assumes that the first argument is a string space separated list of classNames.
// assumes that the second argument is a style object you get after a SCSS import.
// splits the classNameProperty by space to get an array of classNames.
// goes through all the classNames and replaces each className
// with a dynamic className from styles import wherever it finds a match.
export default function (classNameProperty, componentStyles) {
  return classNameProperty && typeof classNameProperty === 'string' &&
    classNameProperty.split(' ').map(currentClassName =>
    componentStyles && componentStyles[currentClassName] || currentClassName);
}
