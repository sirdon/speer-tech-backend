# speer-tech-backend

API documentation
Routes
Here is the API address: https://aircall-job.herokuapp.com.

As you can see, it's hosted on a free Heroku server, which means that the first time you will fetch the API, it will take few seconds to answer.

GET - https://aircall-job.herokuapp.com/activities: get calls to display in the Activity Feed
GET - https://aircall-job.herokuapp.com/activities/:id: retrieve a specific call details
POST - https://aircall-job.herokuapp.com/activities/:id: update a call. The only field updatable is is_archived (bool). You'll need to send a JSON in the request body:
{
  is_archived: true
}
GET - https://aircall-job.herokuapp.com/reset: Reset all calls to initial state (usefull if you archived all calls).
Call object
id - unique ID of call
created_at - creation date
direction - inbound or outbound call
from - caller's number
to - callee's number
via - Aircall number used for the call
duration - duration of a call (in seconds)
is_archived - call is archived or not
call_type - can be a missed, answered or voicemail call.
