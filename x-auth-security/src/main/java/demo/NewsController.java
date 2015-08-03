package demo;

import java.util.Collection;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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
		
		return this.entries.get(id);
	}

	@RequestMapping(value = "/news/{id}", method = RequestMethod.POST)
	NewsEntry update(@RequestBody NewsEntry news) {
		this.entries.put(news.getId(), news);
		return news;
	}

	@RequestMapping(value = "/news", method = RequestMethod.POST)
	NewsEntry add(@RequestBody NewsEntry news) {
		long id = 10 + new Random().nextInt(99);
		news.setId(id);
		this.entries.put(id, news);
		return news;
	}

	NewsController() {
		for (long i = 0; i < 5; i++)
			this.entries.put(i, new NewsEntry(i, "Title #" + i));
	}

}
