const router = require('express').Router();

const Actions = require('./data/helpers/actionModel');
const Projects = require('./data/helpers/projectModel');

//GET for projects //✔
router.get('/', (req, res) => {
  Projects.get()
    .then(proj => {
      res.status(200).json(proj);
    })
    .catch(err => {
      res.status(400).json({ error: "Unable to GET projects" });
    });
});

//GET for specific project //✔
router.get('/:id', validateProjectId, (req, res) => {
  return res.status(200).json(req.projects)
});

//GET for actions of a specific project
router.get('/:id/actions', validateProjectId, (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "There was an error retrieving the actions" });
    });
});

//POST a project //✔
router.post('/', (req, res) => {
  Projects.insert(req.body)
    .then(newProj => {
      //console.log(newProj)
      res.status(201).json(newProj)
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error with the database" });
    });
});

//POST an action to a project //✔
router.post('/:id/actions', validateProjectId, (req, res) => {
  const projId = req.params.id;
  req.body = {...req.body, project_id : projId}

  Actions.insert(req.body)
    .then(act => {
      res.status(201).json(act)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Error adding action" });
    });
});

//PUT (edit) a project //✔
router.put('/:id', validateProjectId, (req, res) => {
  Projects.update(req.params.id, req.body)
    .then(updatedProj => {
      res.status(200).json(updatedProj)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "There was an error updating the project" });
    });
});


//DELETE a project //✔
router.delete('/:id', validateProjectId, (req, res) => {
  console.log(req.params.id)
  Projects.remove(req.params.id)
    .then(deleted => {
      res.status(200).json(deleted)
    })
    .catch(err => {
      res.status(500).json({ error: "Hubo un problema con eliminar el projecto del database" });
    });
});



//Middleware
function validateProjectId(req, res, next) { //✔
  console.log("REQ.PARAMS LOG", req.params)
    Projects.get(req.params.id)
      .then(proj => {
        if (req.params.id === `${proj.id}`) {
        //console.log("THIS IS PROJ", proj)
        req.projects = proj;

        next();
        } else {
          //console.log("ELSE ERROR")
          res.status(404).json({ error: "There was a problem with the database" });
        }
      })
      .catch(err => {
        //console.log(".catch err: ", err)
        res.status(500).json({ error: "Invalid Project ID" });
      })
}

module.exports = router;