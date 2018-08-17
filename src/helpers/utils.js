module.exports.getFullName = (docProfile) => {
  if(!docProfile.name) return ''

  let name = docProfile.name

  var firstTitle
  if(name.first_title) {
    firstTitle = name.first_title + '. '
  } else {
    firstTitle = ''
  }

  var lastTitle
  if(name.last_title) {
    lastTitle = ' ' + name.last_title
  } else {
    lastTitle = ''
  }

  let fullname = `${firstTitle}${name.first_name} ${name.last_name}${lastTitle}`
  return fullname
}
