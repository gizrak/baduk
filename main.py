import jinja2
import webapp2

# Set to true if we want to have our webapp print stack traces, etc
_DEBUG = True

class HomePage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Hello, webapp2 World!')

class AppsPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Hello, webapp2 World!')

app = webapp2.WSGIApplication([
                              ('/', HomePage), 
                              ('/apps', AppsPage)
                              ],
                            debug=_DEBUG)