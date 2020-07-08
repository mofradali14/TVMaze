/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(q) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	const res = await axios.get('http://api.tvmaze.com/search/shows', { params: { q } });
	console.log(res);
	// return [
	// 	{
	// 		id      : 1767,
	// 		name    : 'The Bletchley Circle',
	// 		summary :
	// 			'<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>',
	// 		image   : 'http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg'
	// 	}
	// ];
	const index = Math.floor(Math.random() * res.data.length);
	return [
		{
			id      : res.data[index].show.id,
			name    : res.data[index].show.name,
			summary : res.data[index].show.summary,
			image   : res.data[index].show.image.original
		}
	];
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card bg-dark text-light" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="episodes btn btn-outline-warning">Episodes</button>
           </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
	$('#search-query').val('');
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

	// TODO: return array-of-episode-info, as described in docstring above
	const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	const episode = res.data.map((episode) => ({
		id     : episode.id,
		name   : episode.name,
		season : episode.season,
		number : episode.number
	}));
	return episode;
}

function populateEpisodes(episodes) {
	const $episodes = $('#episodes-list');
	$episodes.empty();

	for (let episode of episodes) {
		let $ep = $(`<li>${episode.name} ( season ${episode.season}, episode ${episode.number})</li>`);
		$episodes.append($ep);
	}
	$('#episodes-area').show();
}

$('#shows-list').on('click', '.episodes', async function handleEpisodes(e) {
	let ID = $(e.target).closest('.Show').data('show-id');
	let episodes = await getEpisodes(ID);
	populateEpisodes(episodes);
});
