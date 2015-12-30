package demo;

import java.util.Collection;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import demo.exception.ErrorDetail;
import demo.exception.MSMException;

@RestController
class NewsController {

	Map<Long, NewsEntry> entries = new ConcurrentHashMap<Long, NewsEntry>();

	@RequestMapping("/news")
	Collection<NewsEntry> entries() {
		System.out.println("/news");
		return this.entries.values();
	}

	@RequestMapping(value = "/news/{id}", method = RequestMethod.DELETE)
	NewsEntry remove(@PathVariable Long id) {
		System.out.println("delete: "+id);
		return this.entries.remove(id);
	}

	@RequestMapping(value = "/news/{id}", method = RequestMethod.GET)
	NewsEntry entry(@PathVariable Long id) {
		NewsEntry newE = this.entries.get(id);
		if (newE == null) {
			throw new MSMException("Managed exception: Entity dont exist");
		}
		return newE;
	}

	@RequestMapping(value = "/news/{id}", method = RequestMethod.POST)
	NewsEntry update(@RequestBody NewsEntry news) {
		NewsEntry newE = this.entries.get(news.getId());
		if (newE == null) {
			throw new MSMException("Managed exception: Entity dont exist");
		}
		this.entries.put(news.getId(), news);
		return news;
	}

	@RequestMapping(value = "/news", method = RequestMethod.POST)
	ResponseEntity<String> add(@RequestBody NewsEntry news) {
		
		if (StringUtils.isEmpty(news.getContent())) {
			return new ResponseEntity<String>("Managed exception: Content cant be null", HttpStatus.BAD_REQUEST);
		}
		
		long id = 10 + new Random().nextInt(99);
		news.setId(id);
		this.entries.put(id, news);
		Gson gson = new Gson();

		String json = gson.toJson(news);
		return new ResponseEntity<String>(json, HttpStatus.OK);
	}

	NewsController() {
		for (long i = 0; i < 5; i++)
			this.entries.put(i, new NewsEntry(i, "Title #" + i));
	}


    @ExceptionHandler(MSMException.class)
	public ErrorDetail myError(HttpServletRequest request, Exception exception) {
	    ErrorDetail error = new ErrorDetail();
	    error.setStatus(HttpStatus.BAD_REQUEST.value());
	    error.setMessage(exception.getMessage());
	    error.setUrl(request.getRequestURL().toString());
	    return error;
	}
}
