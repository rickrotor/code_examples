<?php 
namespace App\Mail;

use stdClass;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderMailer extends Mailable {

    use Queueable, SerializesModels;

    private $data;

    private $file_path;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(stdClass $data, $file_path) {
        $this->data = $data;

        $this->file_path = $file_path;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {
        if($this->file_path){
            return $this->subject('Сообщение с сайта stroisklad43.ru')->view('email.order', ['data' => $this->data])->attach($this->file_path);
        } else {
            return $this->subject('Сообщение с сайта stroisklad43.ru')->view('email.order', ['data' => $this->data]);
        }
        
    }
}