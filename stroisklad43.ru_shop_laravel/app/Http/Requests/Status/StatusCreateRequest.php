<?php

namespace App\Http\Requests\Status;

use Illuminate\Foundation\Http\FormRequest;

class StatusCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|unique:statuses|max:100',
            'sort' => 'required|max:255',
        ];
    }
}
