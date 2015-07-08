<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NewsController extends Controller {

    /**
     * Store a new news.
     *
     * @param  Request  $request
     * @return Response
     */
    public function createNews(Request $request){
        $news = new News;

        $news->title = $request->input('title');
        $news->imageurl = $request->input('imageurl');
        $news->text = $request->input('text');
        $news->isimportant = $request->input('isimportant');
        $news->newsurl = $request->input('newsurl');
        $news->date = $request->input('date');

        $news->save();
        //
    }

    public function updateNews(Request $request, $id){
        $news = News::find($id);

        $news->title = $request->input('title');
        $news->imageurl = $request->input('imageurl');
        $news->text = $request->input('text');
        $news->isimportant = $request->input('isimportant');
        $news->newsurl = $request->input('newsurl');
        $news->date = $request->input('date');

        $news->save();
        //
    }

    public function removeNews($id){
        $news = News::find($id);

        $news->delete();
        //
    }

    //verificar ordenação por isimportant e data

    //isimportant 0-mais importante e 1-n importante

    public function getNews(){

        $news = News::all()->orderBy('isimportant','date');

        $title = $news->title;
        $imageurl = $news->imageurl;
        $text = $news->text;
        $isimportant = $news->isimportant;
        $newsurl = $news->newsurl;
        $date = $news->date;
        
        return View::make('news', array('title' => $title,
                                            'imageurl' => $imageurl,
                                            'text' => $text,
                                            'isimportant' => $isimportant,
                                            'newsurl' => $newsurl,
                                            'date' => $date));
        //
    }



}