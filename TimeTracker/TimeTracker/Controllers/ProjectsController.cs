using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using TimeTracker.Data;
using TimeTracker.Models.ProjectModels;
using TimeTracker.Repositories.Interfacies;
using TimeTracker.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

namespace TimeTracker.Controllers
{
    [Authorize]
    public class ProjectsController : Controller
    {

        private readonly IProjectsService projectsService;

        public ProjectsController(IProjectsService projectsService)
        {
            this.projectsService = projectsService;
        }

        // GET: Projects
        public IActionResult Index()
        {
            return View(projectsService.GetAll());
        }

        // GET: Projects/Details/5
        public IActionResult Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var project = projectsService.Get(id, HttpContext.User);
            if (project == null)
            {
                return NotFound();
            }

            return View(project);
        }

        // GET: Projects/Create
        public IActionResult Create()
        {
            return View(new Project { UsernamesWithIds = projectsService.GetProjectCreateModel(null, HttpContext.User) });
        }

        // POST: Projects/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        //        [ValidateAntiForgeryToken]
        public JsonResult Create([FromBody]Project a)
        {
            if (string.IsNullOrEmpty(a.Title))
            {
                return new JsonResult(new { message = "ProjectTitleMissing" });
            }
            if (projectsService.GetAll().Any(p => p.Title == a.Title))
            {
                return new JsonResult(new { message = "ProjectTitleNotUnique" });
            }
            string newProjectId = projectsService.Add(a, HttpContext.User);
            Project project = projectsService.Get(newProjectId, HttpContext.User);
            project.ProjectMemberIds = projectsService.GetProjectCreateModel(project.Id, HttpContext.User);
            project.UsernamesWithIds = projectsService.GetProjectCreateModel(null, HttpContext.User);
            return new JsonResult(project);
        }

        // GET: Projects/Edit/5
        public IActionResult Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var project = projectsService.Get(id, HttpContext.User);
            if (project == null)
            {
                return NotFound();
            }
            project.ProjectMemberIds = projectsService.GetProjectCreateModel(project.Id, HttpContext.User);
            project.UsernamesWithIds = projectsService.GetProjectCreateModel(null, HttpContext.User);
            return View(project);
        }

        // POST: Projects/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public JsonResult Edit([FromBody]Project project)
        {
            string maybeId = projectsService.Update(project, HttpContext.User);
            if (maybeId == null)
            {
                if (!projectsService.Exists(project.Id))
                {
                    return new JsonResult(new { message = "ProjectNotExists" });
                }
                else
                {
                    return new JsonResult(new { message = "ExceptionWasRaised" });
                }
            }
            project = projectsService.Get(project.Id, HttpContext.User);
            project.ProjectMemberIds = projectsService.GetProjectCreateModel(project.Id, HttpContext.User);
            project.UsernamesWithIds = projectsService.GetProjectCreateModel(null, HttpContext.User);
            return new JsonResult(project);
        }

        // GET: Projects/Delete/5
        public IActionResult Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var project = projectsService.Get(id, HttpContext.User);
            if (project == null)
            {
                return NotFound();
            }

            return View(project);
        }

        // POST: Projects/Delete/5
        [HttpPost, ActionName("Delete")]
        public IActionResult DeleteConfirmed(string id)
        {
            projectsService.Remove(id);
            return RedirectToAction("Index");
        }

    }
}
