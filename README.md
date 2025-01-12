# Rapid Report
### Background
For Deltahacks 2025 we decided to focus on accessbilty and community  building. We noticed there are many places where accessbility needs are not met and saw how tedious the process was when asking for a change so we decided to streamline a process where were double be able to *rapidly report* accessbility needs.

## Idea
Our idea was to create an application that could be used on your browser or phone that would allow you to quickly take a picture of an accessbility issue and a short message describing what the issue is.

*Rapid Report* would then automatically find the relevant recipient (government, business, etc) and generate a professional email to automatically send.

Users would also be able to "like" issues so that more pressing accessbility needs would be met quicker.

## Accessbility
- Our app allows for users with all types of accessbility needs (visual, auditory, cognitive, physical, etc) to report issues with ease through considerations like screen readers, colour schemes, and more
- We made sure our app was simple enough to use so that anybody no matter their abilities or knowledge levels would be able to use it
- After a deep search we were not able to find any applications like ours (at most we found an accessbility map but no report feature)

## Community Building
- Through our "social view" we are able to connect a wide community of people with accessbility needs so that they can voice their needs on a platform that cares
- We believe our project will be help business get a broader perspective of the needs of other's with our app


## Resourses
### Cohere AI
- Used to generate a professional email from the user's accessibilty issue
- Explored using the RAG system to find business emails through giving data with the google search api

### Google APIs
- Used google's geocode api to locate the closest business to the user's current location allowing for potentially quicker reports
- Experimented with google's places api to find data on the closest business to a certain location

### Perplexity AI
- Experimented with perplexity's search-augmented chat api to find business emails and names based on an address

### Other
- NextJS
- Typescript
- Tailwind CSS