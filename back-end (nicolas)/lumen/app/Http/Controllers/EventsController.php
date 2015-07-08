<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EventoController extends Controller {

    /**
     * Store a new events.
     *
     * @param  Request  $request
     * @return Response
     */
    public function createEvento(Request $request){
        $event = new Event;

        $event->title = $request->input('title');
        $event->desc = $request->input('desc');
        $event->date = $request->input('date');
        $event->text = $request->input('text');
        $event->eventurl = $request->input('eventurl');
        $event->save();
        //
    }

    public function updateEvento(Request $request, $id){
        $event = Event::find($id);

        $event->title = $request->input('title');
        $event->desc = $request->input('desc');
        $event->date = $request->input('date');
        $event->text = $request->input('text');
        $event->eventurl = $request->input('eventurl');

        $event->save();
        //
    }

    public function removeEvento($id){
        $event = Event::find($id);

        $event->delete();
        //
    }

    //pegar apenas de determinado mês

    public function getEventos(Request $request, $month){

        //$month = $request->input('month');

        $events = Event::where('date','LIKE','%'.$month.'%')->get();
        
        return View::make('events', array('title' => $title,
                                            'desc' => $desc,
                                            'date' => $date,
                                            'text' => $text,
                                            'eventurl' => $eventurl));
        //
    }



}