import ghpages from "gh-pages"
 
ghpages.publish("dist", function done(err) {
  if (err) {
    console.error(err)
  }
})
