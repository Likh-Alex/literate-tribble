# Simple To Do list #

Objective: fulfilling requirements for Ruby Garage test task.





In order to start using app - User is required to create new account with email and password or login with existing account. 

The application is deployed on Heroku, right [here](https://todolist-for-ruby-garage.herokuapp.com).

User is able to perform all CRUD operations with ToDoLists and It's tasks (Create, Read, Update, Delete).

User has access only to his/her own ToDoLists and Tasks. User entry validation is implemented on both client and server side.


SQL task technical requirements implementation:
-------------------------------
As with given tables

- Tasks (id, name, status, project_id)
- Projects (id, name)

the implementation would be following:


----------


**1** get all statuses, not repeating, alphabetically ordered

    SELECT DISTINCT status FROM tasks ORDER BY status

**2** get the count of all tasks in each project, order by tasks count descending

    SELECT COUNT(*) AS tasks_count FROM projects, tasks WHERE tasks.project_id = projects.id GROUP BY projects.id ORDER BY tasks_count DESC;
    
**3** get the count of all tasks in each project, order by projects names

    SELECT projects.name, COUNT(*) AS tasks_count FROM projects, tasks WHERE tasks.project_id = projects.id GROUP BY projects.id ORDER BY projects.name ASC;

**4** get the tasks for all projects having the name beginning with "N" letter

    SELECT * FROM projects, tasks WHERE tasks.project_id = projects.id AND tasks.name LIKE 'N%';

**5** get the list of all projects containing the 'a' letter in the middle of the name, and show the tasks count near each project. Mention that there can exist projects without tasks and tasks with project_id = NULL

    SELECT projects.id, projects.name, COUNT(*) AS tasks_count FROM projects, tasks WHERE tasks.project_id = projects.id AND projects.name LIKE '%a%' GROUP BY projects.id ORDER BY projects.id ASC;

**6** get the list of tasks with duplicate names. Order alphabetically

    SELECT name, COUNT(name) FROM tasks GROUP BY name HAVING ( COUNT(name) > 1 ) ORDER BY name ASC;

**7** get list of tasks having several exact matches of both name and status, from the project 'Garage'. Order by matches count

    SELECT tasks.name, tasks.status, COUNT(*) AS matches FROM projects, tasks WHERE tasks.project_id = projects.id AND projects.name LIKE 'Garage' GROUP BY tasks.name, tasks.status HAVING COUNT(*) > 1 ORDER BY matches ASC;

**8** get the list of project names having more than 10 tasks in status 'completed'. Order by project_id
 
    SELECT projects.name, COUNT(tasks.status) FROM projects, tasks WHERE tasks.project_id = projects.id AND tasks.status LIKE 'Completed' GROUP BY tasks.status, projects.name, tasks.project_id HAVING COUNT(tasks.status) > 10 ORDER BY tasks.project_id ASC;
