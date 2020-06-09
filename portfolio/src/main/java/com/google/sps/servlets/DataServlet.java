// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.sps.data.UserInfo;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Arrays;
import static java.util.Arrays.*;
import java.util.List;
import com.google.gson.Gson;

final class Task {

  private final long id;
  private final String title;
  private final long timestamp;
  private final String name;

  public Task(long id, String title, long timestamp, String name) {
    this.id = id;
    this.title = title;
    this.timestamp = timestamp;
    this.name = name;

  }
}

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    Query query = new Query("Task").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    List<Task> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      long id = entity.getKey().getId();
      String title = (String) entity.getProperty("title");
      long timestamp = (long) entity.getProperty("timestamp");
      String name = (String) entity.getProperty("name");

      Task user = new Task(id, title, timestamp, name);
      comments.add(user);
      
    }
    Gson gson = new Gson();

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(comments));
    response.sendRedirect("/index.html");
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
      String title = request.getParameter("title");
      String name = request.getParameter("name");
      if (name == "" || name == " ") {
          name = "Unknown";
      }
      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      Entity taskEntity = new Entity("Task");
      long timestamp = System.currentTimeMillis();
      
      taskEntity.setProperty("title", title);
      taskEntity.setProperty("name", name);
      taskEntity.setProperty("timestamp", timestamp);

      
      datastore.put(taskEntity);

      response.sendRedirect("/data");
  }
}
